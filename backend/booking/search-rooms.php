<?php
include("../header.php");
include("../dbConn.php");

$checkIn  = $_GET['checkIn'];   // YYYY-MM-DD
$checkOut = $_GET['checkOut'];  // YYYY-MM-DD
$guests   = (int)$_GET['guests'];

$sql = "
SELECT r.*
FROM rooms r
WHERE 
    r.capacity >= ?
    AND r.status = 'active'
    AND r.room_id NOT IN (
        SELECT rb.facility_id
        FROM room_booking rb
        WHERE rb.status IN ('resched', 'pending', 'approved', 'not_attended', 'arrived')
          AND rb.start_date <= ?
          AND rb.end_date   >= ?
    )
ORDER BY
    CASE 
        WHEN r.capacity = ? THEN 0
        ELSE 1
    END,
    r.capacity ASC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'error' => $conn->error
    ]);
    exit;
}

// PARAMETER ORDER IS IMPORTANT
$stmt->bind_param(
    "isss",
    $guests,     // capacity >= ?
    $checkOut,   // start_date <= ?
    $checkIn,    // end_date >= ?
    $guests      // capacity = ? (priority)
);

$stmt->execute();
$result = $stmt->get_result();

$rooms = [];
while ($row = $result->fetch_assoc()) {
    $rooms[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $rooms,
    'count' => count($rooms),
    'debug' => [
        'checkIn' => $checkIn,
        'checkOut' => $checkOut,
        'guests' => $guests
    ]
]);
?>
