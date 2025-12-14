<?php
include("../header.php");
include("../dbConn.php");
require_once("../auth/auth_middleware.php"); 

$user = require_auth($conn); 

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if ($method === "GET") {

    $bookingId = $_GET['id'] ?? null;
    $userId    = $_GET['user_id'] ?? null;
    $status    = $_GET['status'] ?? null; // Can be comma-separated

    $baseSql = "
        SELECT 
            rb.booking_id, rb.user_id, rb.facility_id, rb.fullname, rb.phone, rb.start_date, rb.end_date,  rb.bookedDate,
            rb.nights, rb.status, rb.price AS booking_price, rb.paid AS booking_paid,

            u.firstname, u.lastname, u.email,

            r.room_id, r.room_name, r.price AS room_price, r.capacity, r.duration,

            be.name AS extra_name, be.quantity AS extra_quantity, be.price AS extra_price,

            bn.note AS note
        FROM room_booking AS rb
        JOIN users AS u ON u.user_id = rb.user_id
        JOIN rooms AS r ON rb.facility_id = r.room_id
        LEFT JOIN booking_extras AS be ON be.booking_id = rb.booking_id
        LEFT JOIN booking_note AS bn ON bn.booking_id = rb.booking_id
    ";

    $params = [];
    $types = "";
    $conditions = [];

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
        // Allow multiple statuses via comma-separated string
        $statusArray = array_map('trim', explode(',', $status));
        $placeholders = implode(',', array_fill(0, count($statusArray), '?'));
        $conditions[] = "rb.status IN ($placeholders)";
        $params = array_merge($params, $statusArray);
        $types .= str_repeat('s', count($statusArray));
    }

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
                'bookedDate' => $row['bookedDate'],
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

                'note' => ($row['status'] === 'declined') ? ($row['note'] ?? null) : null,

                'extras' => []
            ];
        }

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
