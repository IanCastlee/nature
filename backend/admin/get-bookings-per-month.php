<?php
include("../header.php");
include("../dbConn.php");

// Check if year is provided
$hasYear = isset($_GET['year']) && is_numeric($_GET['year']);
$year = $hasYear ? intval($_GET['year']) : null;

// Initialize monthly counts array (1–12)
$monthlyPaidCounts = array_fill(1, 12, 0);
$totalPaid = 0;

// Base SQL
$sql = "SELECT start_date, paid FROM room_booking WHERE paid > 0 AND status = 'arrived'";

// Add year filter ONLY if provided
if ($hasYear) {
    $sql .= " AND YEAR(start_date) = ?";
}

$stmt = $conn->prepare($sql);

// Bind year if needed
if ($hasYear) {
    $stmt->bind_param("i", $year);
}

$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $month = (int) date('n', strtotime($row['start_date']));
    $monthlyPaidCounts[$month] += $row['paid'];
    $totalPaid += $row['paid'];
}

// Convert to 0-indexed array for JS chart
$monthlyPaidCountsIndexed = [];
for ($i = 1; $i <= 12; $i++) {
    $monthlyPaidCountsIndexed[] = $monthlyPaidCounts[$i];
}

// Response
echo json_encode([
    'success' => true,
    'data' => [
        'year' => $hasYear ? $year : 'ALL',
        'totalPaid' => $totalPaid,
        'monthlyPaid' => $monthlyPaidCountsIndexed
    ]
]);
?>
