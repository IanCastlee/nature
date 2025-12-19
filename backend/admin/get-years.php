<?php
include("../header.php");
include("../dbConn.php");

$sql = "SELECT DISTINCT YEAR(start_date) AS year
        FROM room_booking
        ORDER BY year DESC";

$result = $conn->query($sql);

$years = [];

while ($row = $result->fetch_assoc()) {
    if ($row['year'] !== null) {
        $years[] = (int)$row['year'];
    }
}

echo json_encode([
    'success' => true,
    'data' => $years   // 👈 IMPORTANT
]);
?>
