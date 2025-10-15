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

// Required fields
$requiredFields = ["userId", "facility_type", "facility_id", "extras"];
foreach ($requiredFields as $field) {
    if (!isset($_POST[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required field: $field"]);
        exit;
    }
}

$userId = intval($_POST['userId']);
$facilityType = $_POST['facility_type']; // e.g., 'room', 'cottage', 'hall'
$facilityId = intval($_POST['facility_id']);
$extras = $_POST['extras'];

// Map table by facility type
$facilityTableMap = [
    "room" => "rooms",
    "cottage" => "cottages",
    "hall" => "function_halls"
];

if (!array_key_exists($facilityType, $facilityTableMap)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid facility type"]);
    exit;
}

$table = $facilityTableMap[$facilityType];

// Step 1: Get base price from correct table
$facilityQuery = $conn->prepare("SELECT price FROM $table WHERE room_id = ?");
$facilityQuery->bind_param("i", $facilityId);
$facilityQuery->execute();
$facilityResult = $facilityQuery->get_result();

if ($facilityResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Facility not found"]);
    exit;
}

$facility = $facilityResult->fetch_assoc();
$basePrice = floatval($facility['price']);

// Step 2: Recalculate extras
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

    $lineTotal = $price * $quantity;
    $extrasTotal += $lineTotal;

    $sanitizedExtras[] = [
        'id' => $extraId,
        'name' => $name,
        'quantity' => $quantity,
        'price' => $price
    ];
}

// Step 3: Total
$totalPrice = $basePrice + $extrasTotal;

// Step 4: Save booking
$insertBooking = $conn->prepare("
    INSERT INTO booking (user_id, facility_type, facility_id, price)
    VALUES (?, ?, ?, ?)
");
$insertBooking->bind_param("issi", $userId, $facilityType, $facilityId, $totalPrice);

if (!$insertBooking->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save booking"]);
    exit;
}

$bookingId = $insertBooking->insert_id;
$insertBooking->close();

// Step 5: Save extras
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

// ✅ Done
echo json_encode([
    "success" => true,
    "booking_id" => $bookingId,
    "base_price" => $basePrice,
    "extras_total" => $extrasTotal,
    "total_price" => $totalPrice
]);
