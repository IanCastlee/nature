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

if ($method === "GET") {

    // NEW: support ?id=BOOKING_ID
    $bookingId = $_GET['id'] ?? null;
    $userId    = $_GET['user_id'] ?? null;
    $status    = $_GET['status'] ?? null;

    // Base SQL with joins and extras LEFT JOIN
    $baseSql = "
        SELECT 
            rb.booking_id, rb.user_id, rb.facility_id, rb.fullname, rb.phone, rb.start_date, rb.end_date, rb.nights, rb.status, rb.price AS booking_price, rb.paid AS booking_paid,
            u.firstname, u.lastname, u.email,
            r.room_id, r.room_name, r.price AS room_price, r.capacity, r.duration,
            be.name AS extra_name, be.quantity AS extra_quantity, be.price AS extra_price
        FROM room_booking AS rb
        JOIN users AS u ON u.user_id = rb.user_id
        JOIN rooms AS r ON rb.facility_id = r.room_id
        LEFT JOIN booking_extras AS be ON be.booking_id = rb.booking_id
    ";

    $params = [];
    $types = "";
    $conditions = [];

    // NEW: filter by booking_id
    if ($bookingId) {
        $conditions[] = "rb.booking_id = ?";
        $params[] = $bookingId;
        $types .= "i";
    }

    if ($userId) {
        $conditions[] = "rb.user_id = ?";
        $params[] = $userId;
        $types .= "i";
    }

    if ($status) {
        $conditions[] = "rb.status = ?";
        $params[] = $status;
        $types .= "s";
    }

    // Build WHERE clause if conditions exist
    if (!empty($conditions)) {
        $baseSql .= " WHERE " . implode(" AND ", $conditions);
    }

    $baseSql .= " ORDER BY rb.booking_id DESC";

    $stmt = $conn->prepare($baseSql);

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $bookings = [];

    while ($row = $result->fetch_assoc()) {
        $id = $row['booking_id'];

        if (!isset($bookings[$id])) {
            $bookings[$id] = [
                'booking_id' => $row['booking_id'],
                'user_id' => $row['user_id'],
                'facility_id' => $row['facility_id'],
                'start_date' => $row['start_date'],
                'end_date' => $row['end_date'],
                'nights' => $row['nights'],
                'status' => $row['status'],
                'price' => $row['booking_price'],
                'paid' => $row['booking_paid'],
                'half_price' => $row['booking_price'] / 2,
                'fullname' => $row['fullname'],
                'phone' => $row['phone'],
                'email' => $row['email'],
                'room' => [
                    'room_id' => $row['room_id'],
                    'room_name' => $row['room_name'],
                    'price' => $row['room_price'],
                    'capacity' => $row['capacity'],
                    'duration' => $row['duration']
                ],
                'extras' => []
            ];
        }

        // Add extras if exist
        if (!empty($row['extra_name'])) {
            $bookings[$id]['extras'][] = [
                'name' => $row['extra_name'],
                'quantity' => $row['extra_quantity'],
                'price' => $row['extra_price'],
            ];
        }
    }

    echo json_encode([
        "success" => true,
        "data" => array_values($bookings)
    ]);
    exit;
}
?>
