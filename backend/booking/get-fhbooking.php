<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if ($method === "GET") {
    $userId = $_GET['user_id'] ?? null;
    $status = $_GET['status'] ?? null;

    // ----------------------------------------------------
    // UNIVERSAL FETCH FUNCTION WITH MULTIPLE STATUS SUPPORT
    // ----------------------------------------------------
    function fetchBookings($conn, $statuses = []) {
        $query = "
            SELECT 
                orb.*, 
                u.firstname, 
                u.lastname, 
                u.email, 
                fh.name,
                orb.price / 2 AS half_price,
                bn.note AS booking_note_fh
            FROM other_facilities_booking AS orb
            JOIN users AS u ON u.user_id = orb.user_id 
            JOIN function_hall AS fh ON orb.facility_id = fh.fh_id
            LEFT JOIN booking_note_fh AS bn ON bn.booking_id = orb.id
        ";

        if (!empty($statuses)) {
            $placeholders = implode(",", array_fill(0, count($statuses), "?"));
            $query .= " WHERE orb.status IN ($placeholders)";
            $stmt = $conn->prepare($query);

            $types = str_repeat("s", count($statuses));
            $stmt->bind_param($types, ...$statuses);
        } else {
            $stmt = $conn->prepare($query);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // -----------------------------
    // PENDING BOOKINGS
    // -----------------------------
    if ($status === "pending") {
        $data = fetchBookings($conn, ["pending"]);
        echo json_encode(["success" => true, "data" => $data]);
        exit;
    }

    // -----------------------------
    // DECLINED BOOKINGS
    // -----------------------------
    if ($status === "declined") {
        $data = fetchBookings($conn, ["declined"]);
        echo json_encode(["success" => true, "data" => $data]);
        exit;
    }

    // -----------------------------
    // APPROVED BOOKINGS + RESCHEDULED (combined)
    // -----------------------------
    if ($status === "approved") {
        $data = fetchBookings($conn, ["approved", "rescheduled"]);
        echo json_encode(["success" => true, "data" => $data]);
        exit;
    }

    // -----------------------------
    // ARRIVED BOOKINGS
    // -----------------------------
    if ($status === "arrived") {
        $data = fetchBookings($conn, ["arrived"]);
        echo json_encode(["success" => true, "data" => $data]);
        exit;
    }

    // -----------------------------
    // NOT ATTENDED BOOKINGS
    // -----------------------------
    if ($status === "not_attended") {
        $data = fetchBookings($conn, ["not_attended"]);
        echo json_encode(["success" => true, "data" => $data]);
        exit;
    }

    // -----------------------------
    // BOOKINGS BY USER ID
    // -----------------------------
    if ($userId) {
        $stmt = $conn->prepare("
            SELECT 
                rb.booking_id, 
                rb.user_id, 
                rb.facility_id, 
                rb.start_date, 
                rb.end_date, 
                rb.nights, 
                rb.status, 
                rb.price AS booking_price, 
                r.room_id, 
                r.room_name, 
                r.price AS room_price, 
                r.capacity, 
                r.duration, 
                be.name AS extra_name, 
                be.quantity AS extra_quantity, 
                be.price AS extra_price,
                bn.note AS booking_note_fh
            FROM room_booking AS rb
            JOIN rooms AS r ON rb.facility_id = r.room_id
            LEFT JOIN booking_extras AS be ON be.booking_id = rb.booking_id
            LEFT JOIN booking_note_fh AS bn ON bn.booking_id = rb.booking_id
            WHERE rb.user_id = ?
            ORDER BY rb.booking_id DESC
        ");

        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        $bookings = [];

        while ($row = $result->fetch_assoc()) {
            $bookingId = $row['booking_id'];

            if (!isset($bookings[$bookingId])) {
                $bookings[$bookingId] = [
                    'booking_id' => $row['booking_id'],
                    'user_id' => $row['user_id'],
                    'facility_id' => $row['facility_id'],
                    'start_date' => $row['start_date'],
                    'end_date' => $row['end_date'],
                    'nights' => $row['nights'],
                    'status' => $row['status'],
                    'price' => $row['booking_price'],
                    'booking_note_fh' => $row['booking_note_fh'] ?? null,
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

            if (!empty($row['extra_name'])) {
                $bookings[$bookingId]['extras'][] = [
                    'name' => $row['extra_name'],
                    'quantity' => $row['extra_quantity'],
                    'price' => $row['extra_price']
                ];
            }
        }

        echo json_encode(["success" => true, "data" => array_values($bookings)]);
        exit;
    }
}
?>
