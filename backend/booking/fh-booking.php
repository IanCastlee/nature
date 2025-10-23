<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Allow JSON input
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
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

    $stmt = $conn->prepare("UPDATE other_facilities_booking SET status = 'approved' WHERE id = ?");
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
        echo json_encode(["error" => "Missing bookingcvfvgfg id"]);
        exit;
    }

    // 1. Update booking status
    $stmt = $conn->prepare("UPDATE other_facilities_booking SET status = 'declined' WHERE id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to decline booking."]);
        exit;
    }

    // 2. Fetch user_id to notify
    $userStmt = $conn->prepare("SELECT user_id FROM other_facilities_booking WHERE id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Bookingdsds not found."]);
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

// Required fields
$userId     = $_POST['userId'] ?? null;
$fhId       = $_POST['fhId'] ?? null; 
$date       = $_POST['date'] ?? null;
$startTime  = $_POST['startTime'] ?? null;
$endTime    = $_POST['endTime'] ?? null;
$createdAt  = date("Y-m-d H:i:s");

// Validate required input
if (!$userId || !$fhId || !$date || !$startTime || !$endTime) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields.",
    ]);
    exit;
}

// Check if Function Hall exists and get price and duration
$stmt = $conn->prepare("SELECT name, price, duration FROM function_hall WHERE fh_id = ?");
$stmt->bind_param("i", $fhId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Function Hall not found.",
    ]);
    exit;
}

$facility = $result->fetch_assoc();
$facilityType = $facility['name'];
$price = $facility['price']; 

// Optional: Check for overlapping bookings
$conflictStmt = $conn->prepare("
    SELECT * FROM other_facilities_booking 
    WHERE facility_type = ? AND date = ? 
    AND (
        (start_time < ? AND end_time > ?) OR
        (start_time >= ? AND start_time < ?)
    )
");
$conflictStmt->bind_param("ssssss", $facilityType, $date, $endTime, $startTime, $startTime, $endTime);
$conflictStmt->execute();
$conflictResult = $conflictStmt->get_result();

if ($conflictResult->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "This time slot is already booked.",
    ]);
    exit;
}

// Insert booking with price from database
$insertStmt = $conn->prepare("
    INSERT INTO other_facilities_booking (user_id, facility_id, facility_type, date, start_time, end_time, price, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$insertStmt->bind_param(
    "iisssiss",
    $userId,
    $fhId,
    $facilityType,
    $date,
    $startTime,
    $endTime,
    $price,    
    $createdAt
);

if ($insertStmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Booking successful!",
        "price" => $price 
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to insert booking.",
    ]);
}
