<?php
include("../header.php");
include("../dbConn.php");

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== "POST") {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

// Accept raw JSON payload
if (strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

// Required fields check
$requiredFields = ["room_id", "extras"];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input
$roomId = intval($_POST['room_id']);
$extras = $_POST['extras']; // array of extras with id, quantity

// Step 1: Get the actual room price from DB
$roomQuery = $conn->prepare("SELECT price FROM rooms WHERE room_id = ?");
$roomQuery->bind_param("i", $roomId);
$roomQuery->execute();
$roomResult = $roomQuery->get_result();

if ($roomResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Room not found"]);
    exit;
}

$room = $roomResult->fetch_assoc();
$actualRoomPrice = floatval($room['price']);

// Step 2: Recalculate extras using DB prices
$extrasTotal = 0;
$sanitizedExtras = [];

foreach ($extras as $extra) {
    $extraId = intval($extra['id']);
    $quantity = intval($extra['quantity']);

    if ($quantity <= 0) continue;

    // Get actual extra price from DB
    $extraQuery = $conn->prepare("SELECT price, extras FROM room_extras WHERE extra_id = ?");
    $extraQuery->bind_param("i", $extraId);
    $extraQuery->execute();
    $extraResult = $extraQuery->get_result();

    if ($extraResult->num_rows === 0) continue;

    $extraRow = $extraResult->fetch_assoc();
    $price = floatval($extraRow['price']);
    $name = $extraRow['extras'];

    $lineTotal = $price * $quantity;
    $extrasTotal += $lineTotal;

    $sanitizedExtras[] = [
        'id' => $extraId,
        'name' => $name,
        'quantity' => $quantity,
        'price' => $price
    ];
}

// Step 3: Compute final total
$totalPrice = $actualRoomPrice + $extrasTotal;

// Step 4: Insert booking into DB
$insertBooking = $conn->prepare("INSERT INTO bookings (room_id, room_price, extras_total, total_price) VALUES (?, ?, ?, ?)");
$insertBooking->bind_param("iddd", $roomId, $actualRoomPrice, $extrasTotal, $totalPrice);

if (!$insertBooking->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save booking"]);
    exit;
}

$bookingId = $insertBooking->insert_id;
$insertBooking->close();

// Step 5: Insert extras for this booking
if (!empty($sanitizedExtras)) {
    $insertExtra = $conn->prepare("INSERT INTO booking_extras (booking_id, extra_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)");
    
    foreach ($sanitizedExtras as $extra) {
        $insertExtra->bind_param(
            "iisid",
            $bookingId,
            $extra['id'],
            $extra['name'],
            $extra['quantity'],
            $extra['price']
        );
        $insertExtra->execute();
    }

    $insertExtra->close();
}

// ✅ Success
echo json_encode([
    "success" => true,
    "booking_id" => $bookingId,
    "room_price" => $actualRoomPrice,
    "extras_total" => $extrasTotal,
    "total_price" => $totalPrice
]);
