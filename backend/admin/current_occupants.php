<?php
include("../header.php");
include("../dbConn.php");

header("Content-Type: application/json");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "data" => null,
        "message" => "Method not allowed"
    ]);
    exit;
}

/**
 * Helper function to get all dates between start and end
 */
function getBookingDates($startDate, $endDate) {
    $dates = [];
    $current = new DateTime($startDate);
    $end = new DateTime($endDate);

    while ($current <= $end) {
        $dates[] = $current->format('Y-m-d');
        $current->modify('+1 day');
    }

    return $dates;
}

// Fetch bookings that are "arrived" and active today
$query = "
    SELECT 
        rb.fullname,
        r.room_name,
        rb.start_date,
        rb.end_date,
        rb.status
    FROM room_booking rb
    LEFT JOIN rooms r ON r.room_id = rb.facility_id
    WHERE rb.status = 'arrived'
      AND CURDATE() BETWEEN rb.start_date AND rb.end_date
";

$res = $conn->query($query);

if (!$res) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "data" => null,
        "message" => "Database query failed: " . $conn->error
    ]);
    exit;
}

$rows = [];

while ($row = $res->fetch_assoc()) {
    // Add all dates in the booking range
    $row['booking_dates'] = getBookingDates($row['start_date'], $row['end_date']);
    $rows[] = $row;
}

// Return success even if no occupants, with empty array
echo json_encode([
    "success" => true,
    "data" => $rows,
    "message" => count($rows) === 0 ? "No current occupants today" : "Data fetched successfully"
]);

$conn->close();
?>
