<?php
include("../header.php");
include("../dbConn.php");

$checkIn  = $_GET['checkIn'];
$checkOut = $_GET['checkOut'];
$guests   = (int)$_GET['guests'];

$sql = "
SELECT 
    r.*,
    GROUP_CONCAT(ri.image_path) AS images
FROM rooms r
LEFT JOIN room_images ri ON ri.room_id = r.room_id
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
GROUP BY r.room_id
ORDER BY
    CASE 
        WHEN r.capacity = ? THEN 0
        ELSE 1
    END,
    r.capacity ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isss", $guests, $checkOut, $checkIn, $guests);
$stmt->execute();

$result = $stmt->get_result();
$rooms = [];

while ($row = $result->fetch_assoc()) {
    $row['images'] = $row['images']
        ? explode(',', $row['images'])
        : [];
    $rooms[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $rooms,
    'count' => count($rooms)
]);
?>
