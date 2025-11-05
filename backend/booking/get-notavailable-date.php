<?php
include("../header.php");
include("../dbConn.php");
require_once("../auth/auth_middleware.php"); 
$user = require_auth($conn); 

$method = $_SERVER['REQUEST_METHOD'];


// Accept raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}



$facilityId = intval($_GET['facility_id'] ?? 0);

if ($facilityId <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid facility id"
    ]);
    exit;
}

$sql = "SELECT start_date, end_date FROM room_booking WHERE facility_id = ? AND status = 'pending'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $facilityId);
$stmt->execute();
$result = $stmt->get_result();

$bookedDates = [];

while ($row = $result->fetch_assoc()) {
    $bookedDates[] = [
        'start' => $row['start_date'],
        'end' => $row['end_date']
    ];
}

echo json_encode([
    "success" => true,
    "data" => [
        "booked_dates" => $bookedDates
    ]
]);
