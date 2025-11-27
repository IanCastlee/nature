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

    if($status === "pending"){
     $stmt = $conn->prepare("SELECT orb.*, u.firstname, u.lastname, u.email, fh.name, orb.price / 2 AS half_price FROM other_facilities_booking AS orb JOIN users AS u  ON u.user_id = orb.user_id JOIN function_hall AS fh ON orb.facility_id = fh.fh_id WHERE orb.status = 'pending'");
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
    }

  if($status === "declined"){
     $stmt = $conn->prepare("SELECT orb.*, u.firstname, u.lastname, u.email, fh.name FROM other_facilities_booking AS orb JOIN users AS u  ON u.user_id = orb.user_id JOIN function_hall AS fh ON orb.facility_id = fh.fh_id WHERE orb.status = 'declined'");
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
    }

    if($status === "approved"){
     $stmt = $conn->prepare("SELECT orb.*, u.firstname, u.lastname, u.email, fh.name, orb.price / 2, paid AS half_price FROM other_facilities_booking AS orb JOIN users AS u  ON u.user_id = orb.user_id JOIN function_hall AS fh ON orb.facility_id = fh.fh_id WHERE orb.status = 'approved'");
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
    }


    if($status === "arrived"){
    $stmt = $conn->prepare("SELECT orb.*, u.firstname, u.lastname, u.email, fh.name, paid FROM other_facilities_booking AS orb JOIN users AS u  ON u.user_id = orb.user_id JOIN function_hall AS fh ON orb.facility_id = fh.fh_id WHERE orb.status = 'arrived'");
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
    }

    if ($userId) {
        // echo json_encode([
        //     "success" => false,
        //     "message" => "Missing userId"
        // ]);
        // exit;
    

    // Fetch all bookings (with extras)
    $stmt = $conn->prepare("SELECT rb.booking_id, rb.user_id, rb.facility_id, rb.start_date, rb.end_date, rb.nights, rb.status, rb.price AS booking_price, r.room_id, r.room_name, r.price AS room_price, r.capacity, r.duration, be.name AS extra_name, be.quantity AS extra_quantity, be.price AS extra_price FROM room_booking AS rb JOIN rooms AS r ON rb.facility_id = r.room_id LEFT JOIN booking_extras AS be ON be.booking_id = rb.booking_id WHERE rb.user_id = ? ORDER BY rb.booking_id DESC
    ");

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $bookings = [];

    // Group all extras by booking
    while ($row = $result->fetch_assoc()) {
        $bookingId = $row['booking_id'];

        // Initialize booking if not yet added
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

        // Add extras if they exist
        if (!empty($row['extra_name'])) {
            $bookings[$bookingId]['extras'][] = [
                'name' => $row['extra_name'],
                'quantity' => $row['extra_quantity'],
                'price' => $row['extra_price']
            ];
        }
    }

    echo json_encode([
        "success" => true,
        "data" => array_values($bookings)
    ]);
    exit;
}
}

?>
