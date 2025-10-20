<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Allow JSON input
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

// Required fields
$userId     = $_POST['userId'] ?? null;
$fhId       = $_POST['fhId'] ?? null; // Function Hall ID
$date       = $_POST['date'] ?? null;
$startTime  = $_POST['startTime'] ?? null;
$endTime    = $_POST['endTime'] ?? null;
$createdAt  = date("Y-m-d H:i:s");

//  Validate required input
if (!$userId || !$fhId || !$date || !$startTime || !$endTime) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields.",
    ]);
    exit;
}

//  Check if Function Hall exists and get secure data
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

//  Optional: Check for overlapping bookings
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

//  Insert booking
$insertStmt = $conn->prepare("
    INSERT INTO other_facilities_booking (user_id, facility_id, facility_type, date, start_time, end_time, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$insertStmt->bind_param("iisssss", $userId, $fhId, $facilityType, $date, $startTime, $endTime, $createdAt);

if ($insertStmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Booking successful!",
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to insert booking.",
    ]);
}
