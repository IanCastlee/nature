<?php
include("../header.php");
include("../dbConn.php");
require_once("../auth/auth_middleware.php"); 

header('Content-Type: application/json');
$user = require_auth($conn); 

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Room Bookings (pending)
$pendingRoomBookings = $conn->query("SELECT COUNT(*) AS count FROM room_booking WHERE status='pending'")->fetch_assoc()['count'];

// Function Hall Bookings (pending)
$functionHallBookings = $conn->query("SELECT COUNT(*) AS count FROM other_facilities_booking WHERE status='pending'")->fetch_assoc()['count'];

// Not Verified Users
$notVerifiedUsers = $conn->query("SELECT COUNT(*) AS count FROM users WHERE acc_type != 'admin' AND email_verified=0")->fetch_assoc()['count'];

// Verified Users
$verifiedUsers = $conn->query("SELECT COUNT(*) AS count FROM users WHERE acc_type != 'admin' AND email_verified=1")->fetch_assoc()['count'];

// Rooms
$availableRooms = $conn->query("SELECT COUNT(*) AS count FROM rooms WHERE status = 'active'")->fetch_assoc()['count'];
$notAvailableRooms = $conn->query("SELECT COUNT(*) AS count FROM rooms WHERE status = 'inactive'")->fetch_assoc()['count'];

// Function Halls
$availableHalls = $conn->query("SELECT COUNT(*) AS count FROM function_hall WHERE status = 'active'")->fetch_assoc()['count'];
$notAvailableHalls = $conn->query("SELECT COUNT(*) AS count FROM function_hall WHERE status = 'inactive'")->fetch_assoc()['count'];

// Cottages
$availableCottages = $conn->query("SELECT COUNT(*) AS count FROM cottages WHERE status = 'active'")->fetch_assoc()['count'];
$notAvailableCottages = $conn->query("SELECT COUNT(*) AS count FROM cottages WHERE status = 'inactive'")->fetch_assoc()['count'];

// Under Maintenance
$roomsUnderMaintenance = $conn->query("SELECT COUNT(*) AS count FROM rooms WHERE status='under maintenance'")->fetch_assoc()['count'];
$hallsUnderMaintenance = $conn->query("SELECT COUNT(*) AS count FROM function_hall WHERE status='under maintenance'")->fetch_assoc()['count'];

// Top 3 Most Booked Rooms (status = 'arrived')
$mostBookedRooms = [];
$roomResult = $conn->query("
    SELECT r.room_name, COUNT(rb.booking_id) AS count
    FROM room_booking rb
    JOIN rooms r ON rb.facility_id = r.room_id
    WHERE rb.status='arrived'
    GROUP BY rb.facility_id
    ORDER BY count DESC
    LIMIT 3
");

while($row = $roomResult->fetch_assoc()) {
    $mostBookedRooms[] = $row['room_name'] . " (" . $row['count'] . ")";
}

// Top 3 Most Booked Function Halls (status = 'arrived')
$mostBookedHalls = [];
$hallResult = $conn->query("
    SELECT f.name AS hall_name, COUNT(ofb.id) AS count
    FROM other_facilities_booking ofb
    JOIN function_hall f ON ofb.facility_id = f.fh_id
    WHERE ofb.status='arrived'
    GROUP BY ofb.facility_id
    ORDER BY count DESC
    LIMIT 3
");

while($row = $hallResult->fetch_assoc()) {
    $mostBookedHalls[] = $row['hall_name'] . " (" . $row['count'] . ")";
}

// Wrap data inside a success object
$data = [
    'pendingRoomBookings' => $pendingRoomBookings,
    'functionHallBookings' => $functionHallBookings,
    'notVerifiedUsers' => $notVerifiedUsers,
    'verifiedUsers' => $verifiedUsers,
    'availableRooms' => $availableRooms,
    'notAvailableRooms' => $notAvailableRooms,
    'availableHalls' => $availableHalls,
    'notAvailableHalls' => $notAvailableHalls,
    'availableCottages' => $availableCottages,
    'notAvailableCottages' => $notAvailableCottages,
    'roomsUnderMaintenance' => $roomsUnderMaintenance,
    'hallsUnderMaintenance' => $hallsUnderMaintenance,
    'mostBookedRooms' => $mostBookedRooms,   // now an array of top 3 rooms
    'mostBookedHalls' => $mostBookedHalls,   // now an array of top 3 halls
];

echo json_encode([
    'success' => true,
    'data' => $data
]);
