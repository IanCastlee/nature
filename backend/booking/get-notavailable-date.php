<?php
include("../header.php");
include("../dbConn.php");
// require_once("../auth/auth_middleware.php"); 
// $user = require_auth($conn);

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && isset($_SERVER["CONTENT_TYPE"]) 
    && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
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

/**
 * Fetch bookings
 * NOTE:
 * start_date = check-in (blocked)
 * end_date   = check-out (NOT blocked)
 */
$sql = "
SELECT start_date, end_date
FROM room_booking
WHERE facility_id = ?
  AND status NOT IN ('declined', 'resched')
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $facilityId);
$stmt->execute();
$result = $stmt->get_result();

$bookedDates = [];

while ($row = $result->fetch_assoc()) {

    $startDate = $row['start_date'];
    $endDate   = date('Y-m-d', strtotime($row['end_date'] . ' -1 day'));

    // Prevent invalid or zero-length ranges
    if ($startDate <= $endDate) {
        $bookedDates[] = [
            'start' => $startDate,
            'end'   => $endDate
        ];
    }
}

echo json_encode([
    "success" => true,
    "data" => [
        "booked_dates" => $bookedDates
    ]
]);
