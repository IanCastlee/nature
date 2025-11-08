<?php

include("../header.php");
include("../dbConn.php");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

// Accept JSON body
if (strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

$action = $_POST['action'] ?? 'create';
$id = $_POST['id'] ?? null;

/**---------------------------------------------------------
 * 1. APPROVE BOOKING
 *--------------------------------------------------------*/
if ($action === "set_approve") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE room_booking SET status = 'approved' WHERE booking_id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Booking approved."]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    }
    exit;
}


/**---------------------------------------------------------
 * 2. DECLINE BOOKING + INSERT NOTIFICATION
 *--------------------------------------------------------*/
if ($action === "set_decline" || $action === "set_declined") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // 1. Update booking status
    $stmt = $conn->prepare("UPDATE room_booking SET status = 'declined' WHERE booking_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to decline booking."]);
        exit;
    }

    // 2. Fetch user_id to notify
    $userStmt = $conn->prepare("SELECT user_id FROM room_booking WHERE booking_id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Booking not found."]);
        exit;
    }

    $row = $userResult->fetch_assoc();
    $userId = $row['user_id'];

    // 3. Insert notification
    $reason = trim($_POST['reason'] ?? "Your booking has been declined.");
    $from = 'admin';
    $to = $userId;

    $notifStmt = $conn->prepare("
        INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
        VALUES (?, ?, ?, 0, NOW())
    ");
    $notifStmt->bind_param("sis", $from, $to, $reason);

    if (!$notifStmt->execute()) {
        echo json_encode(["success" => false, "message" => "Booking declined, but failed to notify user."]);
        exit;
    }

    echo json_encode(["success" => true, "message" => "Booking declined and user notified."]);
    exit;
}


/**---------------------------------------------------------
 * 3. CREATE BOOKING
 *--------------------------------------------------------*/
$requiredFields = ["userId", "facility_id", "extras", "check_in", "check_out"];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required field: $field"]);
        exit;
    }
}

$userId = intval($_POST['userId']);
$facilityId = intval($_POST['facility_id']);
$extras = $_POST['extras'] ?? [];
$checkIn = $_POST['check_in'];
$checkOut = $_POST['check_out'];
$nights = intval($_POST['nights'] ?? 1);
$frontendTotalPrice = floatval($_POST['total_price'] ?? 0);

// Validate dates
if (!$checkIn || !$checkOut) {
    http_response_code(400);
    echo json_encode(["error" => "Check-in and check-out dates are required"]);
    exit;
}

// Get room price
$facilityQuery = $conn->prepare("SELECT price FROM rooms WHERE room_id = ?");
$facilityQuery->bind_param("i", $facilityId);
$facilityQuery->execute();
$facilityResult = $facilityQuery->get_result();

if ($facilityResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Room not found"]);
    exit;
}

$facility = $facilityResult->fetch_assoc();
$basePrice = floatval($facility['price']) * $nights;

// Calculate extras
$extrasTotal = 0;
$sanitizedExtras = [];

foreach ($extras as $extra) {
    $extraId = intval($extra['id']);
    $quantity = intval($extra['quantity']);
    if ($quantity <= 0) continue;

    $extraQuery = $conn->prepare("SELECT price, extras FROM extras WHERE extra_id = ?");
    $extraQuery->bind_param("i", $extraId);
    $extraQuery->execute();
    $extraResult = $extraQuery->get_result();
    if ($extraResult->num_rows === 0) continue;

    $extraRow = $extraResult->fetch_assoc();
    $lineTotal = floatval($extraRow['price']) * $quantity * $nights;
    $extrasTotal += $lineTotal;

    $sanitizedExtras[] = [
        'id' => $extraId,
        'name' => $extraRow['extras'],
        'quantity' => $quantity,
        'price' => $extraRow['price']
    ];
}

$totalPrice = $basePrice + $extrasTotal;

// Save booking
$insertBooking = $conn->prepare("
    INSERT INTO room_booking (user_id, facility_id, start_date, end_date, nights, status, price)
    VALUES (?, ?, ?, ?, ?, 'pending', ?)
");
$insertBooking->bind_param("iissid", $userId, $facilityId, $checkIn, $checkOut, $nights, $totalPrice);

if (!$insertBooking->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save booking"]);
    exit;
}

$bookingId = $insertBooking->insert_id;
$insertBooking->close();

// Insert extras
if (!empty($sanitizedExtras)) {
    $insertExtra = $conn->prepare("
        INSERT INTO booking_extras (booking_id, extra_id, name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($sanitizedExtras as $extra) {
        $insertExtra->bind_param(
            "iisid",
            $bookingId,
            $extra['id'],
            $extra['name'],
            $extra['quantity'],
            $extra['price']
        );
        $insertExtra->execute();
    }

    $insertExtra->close();
}

echo json_encode([
    "success" => true,
    "booking_id" => $bookingId,
    "base_price" => $basePrice,
    "extras_total" => $extrasTotal,
    "total_price" => $totalPrice
]);
exit;
