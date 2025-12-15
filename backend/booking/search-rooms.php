<?php
include("../header.php");
include("../dbConn.php");

$checkIn = $_GET['checkIn'];
$checkOut = $_GET['checkOut'];
$guests = (int)$_GET['guests'];
// $categoryId = (int)$_GET['categoryId'];

// Query to get rooms that match capacity & category, and are active (available)
$sql = "
SELECT r.*
FROM rooms r
WHERE 
   r.capacity >= ?
  AND r.status = 'active'
  AND r.room_id NOT IN (
    SELECT rb.facility_id
    FROM room_booking rb
    WHERE rb.status IN ('booked', 'pending')
      AND NOT (rb.end_date <= ? OR rb.start_date >= ?)
  )
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => $conn->error]);
    exit;
}

// Bind parameters: categoryId, guests, checkIn, checkOut
$stmt->bind_param("iss", $guests, $checkIn, $checkOut);

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
        'guests' => $guests,
       
    ]
]);
?>
