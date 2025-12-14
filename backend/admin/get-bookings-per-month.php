<?php
include("../header.php");
include("../dbConn.php");

// Get year from query param
$year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');

// Initialize monthly counts array (1-12)
$monthlyPaidCounts = array_fill(1, 12, 0);
$totalPaid = 0;

// Fetch paid bookings for the year
$sql = "SELECT start_date, paid FROM room_booking 
        WHERE YEAR(start_date) = ? AND paid > 0";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $year);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $month = (int)date('n', strtotime($row['start_date'])); // 1-12
    $monthlyPaidCounts[$month] += $row['paid']; // sum paid per month
    $totalPaid += $row['paid'];
}

// Convert monthly array to 0-indexed for JS chart
$monthlyPaidCountsIndexed = [];
for ($i = 1; $i <= 12; $i++) {
    $monthlyPaidCountsIndexed[] = $monthlyPaidCounts[$i];
}

// Return JSON in a way compatible with useGetData
echo json_encode([
    'success' => true,
    'data' => [
        'year' => $year,
        'totalPaid' => $totalPaid,
        'monthlyPaid' => $monthlyPaidCountsIndexed
    ]
]);
?>
