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
if (
    isset($_SERVER["CONTENT_TYPE"]) && 
    strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false
) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

$action = $_POST['action'] ?? 'create';
$id = $_POST['id'] ?? null;

/**
 * ========================================================
 *  APPROVE BOOKING
 * ========================================================
 */
if ($action === "set_approve") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'approved', paid = price / 2 
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Booking approved."])
        : json_encode(["success" => false, "message" => $stmt->error]);

    exit;
}

/**
 * ========================================================
 *  DECLINE BOOKING WITH NOTE
 * ========================================================
 */
if ($action === "set_decline") {

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // Get decline reason
    $reason = trim($_POST['reason'] ?? "");

    if ($reason === "") {
        echo json_encode([
            "success" => false,
            "message" => "Decline reason is required."
        ]);
        exit;
    }

    // 1. UPDATE BOOKING STATUS
    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'declined'
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => $stmt->error]);
        exit;
    }

    // 2. INSERT INTO booking_note
    $noteStmt = $conn->prepare("
        INSERT INTO booking_note (booking_id, note)
        VALUES (?, ?)
    ");
    $noteStmt->bind_param("is", $id, $reason);

    if (!$noteStmt->execute()) {
        echo json_encode([
            "success" => false,
            "message" => "Declined but failed to save note: " . $noteStmt->error
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Booking declined and note saved."
    ]);
    exit;
}


/**
 * ========================================================
 *  DECLINE BOOKING + NOTIFY USER
 * ========================================================
 */
if ($action === "set_decline" || $action === "set_declined") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // 1. Update booking
    $stmt = $conn->prepare("UPDATE room_booking SET status = 'declined' WHERE booking_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to decline booking"]);
        exit;
    }

    // 2. Get user ID
    $userStmt = $conn->prepare("SELECT user_id FROM room_booking WHERE booking_id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Booking not found"]);
        exit;
    }

    $userId = $userResult->fetch_assoc()['user_id'];

    // 3. Insert notification
    $reason = trim($_POST['reason'] ?? "Your booking has been declined.");
    $from = 'admin';

    $notifStmt = $conn->prepare("
        INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
        VALUES (?, ?, ?, 0, NOW())
    ");
    $notifStmt->bind_param("sis", $from, $userId, $reason);

    echo $notifStmt->execute()
        ? json_encode(["success" => true, "message" => "Booking declined and user notified"])
        : json_encode(["success" => false, "message" => "Failed to notify user"]);

    exit;
}

/**
 * ========================================================
 * 1. CLIENT ARRIVED BOOKING
 * ========================================================
 */
if ($action === "set_arrived") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'arrived', 
            paid = price 
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Client arrived, payment completed."])
        : json_encode(["success" => false, "message" => $stmt->error]);

    exit;
}


/**
 * ========================================================
 *  SET BACK TO PENDING + NOTIFY
 * ========================================================
 */
if ($action === "set_pending") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE room_booking SET status = 'pending', paid = 0 WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to update booking"]);
        exit;
    }

    $userStmt = $conn->prepare("SELECT user_id FROM room_booking WHERE booking_id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Booking not found"]);
        exit;
    }

    $userId = $userResult->fetch_assoc()['user_id'];
    $reason = trim($_POST['reason'] ?? "Your booking is pending again.");
    $from = 'admin';

    $notifStmt = $conn->prepare("
        INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
        VALUES (?, ?, ?, 0, NOW())
    ");
    $notifStmt->bind_param("sis", $from, $userId, $reason);

    echo $notifStmt->execute()
        ? json_encode(["success" => true, "message" => "Status updated and user notified"])
        : json_encode(["success" => false, "message" => "Notification failed"]);

    exit;
}

/**
 * ========================================================
 *  SET BACK TO APPROVED (FROM ARRIVED)
 * ========================================================
 */
if ($action === "set_backtoapproved") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // Set status back to approved and reset paid to half the price
    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'approved',
            paid = price / 2
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Booking moved back to approved."])
        : json_encode(["success" => false, "message" => $stmt->error]);

    exit;
}

/**
 * ========================================================
 *  SET BOOKING AS NOT ATTENDED
 * ========================================================
 */
if ($action === "set_not_attended") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // 1. Update booking status
    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'not_attended'
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => $stmt->error]);
        exit;
    }

    // 2. Get user ID for notification
    $userStmt = $conn->prepare("SELECT user_id FROM room_booking WHERE booking_id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Booking not found"]);
        exit;
    }

    $userId = $userResult->fetch_assoc()['user_id'];

    // 3. Insert notification for the user
    $from = 'admin';
    $reason = trim($_POST['reason'] ?? "Your booking was marked as Not Attended.");

    $notifStmt = $conn->prepare("
        INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
        VALUES (?, ?, ?, 0, NOW())
    ");
    $notifStmt->bind_param("sis", $from, $userId, $reason);

    echo $notifStmt->execute()
        ? json_encode(["success" => true, "message" => "Booking marked as Not Attended and user notified."])
        : json_encode(["success" => false, "message" => "Failed to notify user."]);

    exit;
}


/**
 * ========================================================
 * CREATE BOOKING (GUEST MODE, NO USER ID)
 * ========================================================
 */
$requiredFields = ["facility_id", "check_in", "check_out", "fullname", "phone"];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing field: $field"]);
        exit;
    }
}

$fullname = $_POST['fullname'];
$phone = $_POST['phone'];

$facilityId = intval($_POST['facility_id']);
$checkIn = $_POST['check_in'];
$checkOut = $_POST['check_out'];
$nights = intval($_POST['nights'] ?? 1);

$frontendTotalPrice = floatval($_POST['total_price'] ?? 0);
$extras = $_POST['extras'] ?? [];

// Convert date format if needed (ensures valid MySQL date)
$checkIn = date("Y-m-d", strtotime($checkIn));
$checkOut = date("Y-m-d", strtotime($checkOut));

// Get base room price
$facilityQuery = $conn->prepare("SELECT price FROM rooms WHERE room_id = ?");
$facilityQuery->bind_param("i", $facilityId);
$facilityQuery->execute();

$facilityResult = $facilityQuery->get_result();
if ($facilityResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Room not found"]);
    exit;
}

$basePrice = floatval($facilityResult->fetch_assoc()['price']) * $nights;

// Calculate extras
$extrasTotal = 0;
$sanitizedExtras = [];

foreach ($extras as $extra) {
    $eid = intval($extra['id']);
    $qty = intval($extra['quantity']);

    if ($qty <= 0) continue;

    $extraQuery = $conn->prepare("SELECT price, extras FROM extras WHERE extra_id = ?");
    $extraQuery->bind_param("i", $eid);
    $extraQuery->execute();
    $extraResult = $extraQuery->get_result();

    if ($extraResult->num_rows === 0) continue;

    $extraRow = $extraResult->fetch_assoc();
    $line = floatval($extraRow['price']) * $qty * $nights;

    $extrasTotal += $line;

    $sanitizedExtras[] = [
        "id" => $eid,
        "name" => $extraRow['extras'],
        "quantity" => $qty,
        "price" => $extraRow['price']
    ];
}

$totalPrice = $basePrice + $extrasTotal;

// INSERT MAIN BOOKING
$insertBooking = $conn->prepare("
    INSERT INTO room_booking 
    (fullname, phone, facility_id, start_date, end_date, nights, status, price)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
");

$insertBooking->bind_param(
    "ssissid",
    $fullname,
    $phone,
    $facilityId,
    $checkIn,
    $checkOut,
    $nights,
    $totalPrice
);

if (!$insertBooking->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Booking failed"]);
    exit;
}

$bookingId = $insertBooking->insert_id;

// INSERT EXTRAS
if (!empty($sanitizedExtras)) {
    $ins = $conn->prepare("
        INSERT INTO booking_extras (booking_id, extra_id, name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($sanitizedExtras as $ex) {
        $ins->bind_param("iisid", $bookingId, $ex['id'], $ex['name'], $ex['quantity'], $ex['price']);
        $ins->execute();
    }
}

echo json_encode([
    "success" => true,
    "booking_id" => $bookingId,
    'fullname' => $fullname,
    'phone' => $phone,
    "start_date" => $checkIn,
    "end_date" => $checkOut,
    "nights" => $nights,
    "base_price" => $basePrice,
    "extras_total" => $extrasTotal,
    "total_price" => $totalPrice,
    "extras" => $sanitizedExtras
]);
exit;
