<?php
include("../header.php");
include("../dbConn.php");

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

// Accept JSON body
if (strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

//  Required fields
$requiredFields = ["userId", "facility_id", "extras", "check_in", "check_out"];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required field: $field"]);
        exit;
    }
}

$userId = intval($_POST['userId']);
$facilityId = intval($_POST['facility_id']);
$extras = $_POST['extras'] ?? [];
$checkIn = $_POST['check_in'] ?? null;
$checkOut = $_POST['check_out'] ?? null;
$nights = intval($_POST['nights'] ?? 1);
$frontendTotalPrice = floatval($_POST['total_price'] ?? 0);

//  Validate check-in/out
if (!$checkIn || !$checkOut) {
    http_response_code(400);
    echo json_encode(["error" => "Check-in and check-out dates are required"]);
    exit;
}

//  Get base price from `rooms` table
$facilityQuery = $conn->prepare("SELECT price FROM rooms WHERE room_id = ?");
$facilityQuery->bind_param("i", $facilityId);
$facilityQuery->execute();
$facilityResult = $facilityQuery->get_result();

if ($facilityResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Room not found"]);
    exit;
}

$facility = $facilityResult->fetch_assoc();
$basePrice = floatval($facility['price']) * $nights;

//  Recalculate extras
$extrasTotal = 0;
$sanitizedExtras = [];

foreach ($extras as $extra) {
    $extraId = intval($extra['id']);
    $quantity = intval($extra['quantity']);

    if ($quantity <= 0) continue;

    $extraQuery = $conn->prepare("SELECT price, extras FROM extras WHERE extra_id = ?");
    $extraQuery->bind_param("i", $extraId);
    $extraQuery->execute();
    $extraResult = $extraQuery->get_result();

    if ($extraResult->num_rows === 0) continue;

    $extraRow = $extraResult->fetch_assoc();
    $price = floatval($extraRow['price']);
    $name = $extraRow['extras'];

    $lineTotal = $price * $quantity * $nights;
    $extrasTotal += $lineTotal;

    $sanitizedExtras[] = [
        'id' => $extraId,
        'name' => $name,
        'quantity' => $quantity,
        'price' => $price
    ];
}

//  Final price
$totalPrice = $basePrice + $extrasTotal;

// Optionally compare frontend vs backend total
if (abs($frontendTotalPrice - $totalPrice) > 0.01) {
    // log discrepancy if needed
}

//  Save booking to `room_booking`
$insertBooking = $conn->prepare("
    INSERT INTO room_booking (user_id, facility_id, start_date, end_date, status, price)
    VALUES (?, ?, ?, ?, 'pending', ?)
");

$insertBooking->bind_param(
    "iissd",
    $userId,
    $facilityId,
    $checkIn,
    $checkOut,
    $totalPrice
);

if (!$insertBooking->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save booking"]);
    exit;
}

$bookingId = $insertBooking->insert_id;
$insertBooking->close();

//  Save extras
if (!empty($sanitizedExtras)) {
    $insertExtra = $conn->prepare("
        INSERT INTO booking_extras (booking_id, extra_id, name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    ");

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

//  Response
echo json_encode([
    "success" => true,
    "booking_id" => $bookingId,
    "base_price" => $basePrice,
    "extras_total" => $extrasTotal,
    "total_price" => $totalPrice
]);
