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
if (
    isset($_SERVER["CONTENT_TYPE"]) && 
    strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false
) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

$action = $_POST['action'] ?? 'create';
$id = $_POST['id'] ?? null;



/**
 * ========================================================
 *  APPROVE BOOKING (FULL / HALF / CUSTOM)
 * ========================================================
 */
if ($action === "set_approve") {

    $id = intval($_POST['booking_id'] ?? 0);
    $paymentType = $_POST['payment_type'] ?? '';

    if (!$id || !in_array($paymentType, ['half', 'full', 'custom'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid request"]);
        exit;
    }

    // Get booking price from DB (source of truth)
    $stmt = $conn->prepare("SELECT price FROM room_booking WHERE booking_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $booking = $result->fetch_assoc();

    if (!$booking) {
        echo json_encode(["error" => "Booking not found"]);
        exit;
    }

    $price = floatval($booking['price']);

    // Decide payment
    if ($paymentType === 'half') {
        $paid = $price / 2;
        $down = $price / 2;
    }

    if ($paymentType === 'full') {
        $paid = $price;
        $down = $price;
    }

    if ($paymentType === 'custom') {
        $amount = floatval($_POST['amount'] ?? 0);

        if ($amount <= 0 || $amount > $price) {
            echo json_encode(["error" => "Invalid custom amount"]);
            exit;
        }

        $paid = $amount;
        $down = $amount;
    }

    // Update booking
    $stmt = $conn->prepare("
        UPDATE room_booking
        SET 
            status = 'approved',
            paid = ?,
            down_payment = ?
        WHERE booking_id = ?
    ");
    $stmt->bind_param("ddi", $paid, $down, $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Booking approved"])
        : json_encode(["success" => false, "message" => $stmt->error]);

    exit;
}


/**
 * ========================================================
 *  DECLINE BOOKING WITH NOTE
 * ========================================================
 */
if ($action === "set_decline") {

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // Get decline reason
    $reason = trim($_POST['reason'] ?? "");

    if ($reason === "") {
        echo json_encode([
            "success" => false,
            "message" => "Decline reason is required."
        ]);
        exit;
    }

    // 1. UPDATE BOOKING STATUS
    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'declined'
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => $stmt->error]);
        exit;
    }

    // 2. INSERT INTO booking_note
    $noteStmt = $conn->prepare("
        INSERT INTO booking_note (booking_id, note)
        VALUES (?, ?)
    ");
    $noteStmt->bind_param("is", $id, $reason);

    if (!$noteStmt->execute()) {
        echo json_encode([
            "success" => false,
            "message" => "Declined but failed to save note: " . $noteStmt->error
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Booking declined and note saved."
    ]);
    exit;
}


/**
 * ========================================================
 *  DECLINE BOOKING + NOTIFY USER
 * ========================================================
 */
if ($action === "set_decline" || $action === "set_declined") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // 1. Update booking
    $stmt = $conn->prepare("UPDATE room_booking SET status = 'declined' WHERE booking_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to decline booking"]);
        exit;
    }

    // 2. Get user ID
    $userStmt = $conn->prepare("SELECT user_id FROM room_booking WHERE booking_id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Booking not found"]);
        exit;
    }

    $userId = $userResult->fetch_assoc()['user_id'];

    // 3. Insert notification
    $reason = trim($_POST['reason'] ?? "Your booking has been declined.");
    $from = 'admin';

    $notifStmt = $conn->prepare("
        INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
        VALUES (?, ?, ?, 0, NOW())
    ");
    $notifStmt->bind_param("sis", $from, $userId, $reason);

    echo $notifStmt->execute()
        ? json_encode(["success" => true, "message" => "Booking declined and user notified"])
        : json_encode(["success" => false, "message" => "Failed to notify user"]);

    exit;
}

/**
 * ========================================================
 * 1. CLIENT ARRIVED BOOKING
 * ========================================================
 */
if ($action === "set_arrived") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'arrived', 
            paid = price 
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Client arrived, payment completed."])
        : json_encode(["success" => false, "message" => $stmt->error]);

    exit;
}


/**
 * ========================================================
 *  SET BACK TO PENDING + NOTIFY
 * ========================================================
 */
if ($action === "set_pending") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE room_booking SET status = 'pending', paid = 0, down_payment = 0 WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to update booking"]);
        exit;
    }

    $userStmt = $conn->prepare("SELECT user_id FROM room_booking WHERE booking_id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Booking not found"]);
        exit;
    }

    $userId = $userResult->fetch_assoc()['user_id'];
    $reason = trim($_POST['reason'] ?? "Your booking is pending again.");
    $from = 'admin';

    $notifStmt = $conn->prepare("
        INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
        VALUES (?, ?, ?, 0, NOW())
    ");
    $notifStmt->bind_param("sis", $from, $userId, $reason);

    echo $notifStmt->execute()
        ? json_encode(["success" => true, "message" => "Status updated and user notified"])
        : json_encode(["success" => false, "message" => "Notification failed"]);

    exit;
}

/**
 * ========================================================
 *  SET BACK TO APPROVED (FROM ARRIVED)
 * ========================================================
 */
if ($action === "set_backtoapproved") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // Set status back to approved and reset paid to half the price
    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'approved',
            paid = down_payment
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Booking moved back to approved."])
        : json_encode(["success" => false, "message" => $stmt->error]);

    exit;
}

/**
 * ========================================================
 *  SET BOOKING AS NOT ATTENDED
 * ========================================================
 */
if ($action === "set_not_attended") {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    // 1. Update booking status
    $stmt = $conn->prepare("
        UPDATE room_booking 
        SET status = 'not_attended'
        WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => $stmt->error]);
        exit;
    }

    // 2. Get user ID for notification
    $userStmt = $conn->prepare("SELECT user_id FROM room_booking WHERE booking_id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Booking not found"]);
        exit;
    }

    $userId = $userResult->fetch_assoc()['user_id'];

    // 3. Insert notification for the user
    $from = 'admin';
    $reason = trim($_POST['reason'] ?? "Your booking was marked as Not Attended.");

    $notifStmt = $conn->prepare("
        INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
        VALUES (?, ?, ?, 0, NOW())
    ");
    $notifStmt->bind_param("sis", $from, $userId, $reason);

    echo $notifStmt->execute()
        ? json_encode(["success" => true, "message" => "Booking marked as Not Attended and user notified."])
        : json_encode(["success" => false, "message" => "Failed to notify user."]);

    exit;
}


/**
 * ========================================================
 * CREATE BOOKING (GUEST MODE)
 * ========================================================
 */

// Required fields
$requiredFields = ["facility_id", "check_in", "check_out", "fullname", "phone"];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing field: $field"]);
        exit;
    }
}

$fullname = $_POST['fullname'];
$phone = $_POST['phone'];
$facilityId = intval($_POST['facility_id']);
$checkIn = date("Y-m-d", strtotime($_POST['check_in']));
$checkOut = date("Y-m-d", strtotime($_POST['check_out']));
$nights = intval($_POST['nights'] ?? 1);
$extras = $_POST['extras'] ?? [];

// -------------------
// Get base room price
// -------------------
$facilityQuery = $conn->prepare("SELECT price FROM rooms WHERE room_id = ?");
$facilityQuery->bind_param("i", $facilityId);
$facilityQuery->execute();
$facilityResult = $facilityQuery->get_result();
if ($facilityResult->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Room not found"]);
    exit;
}
$baseRoomPrice = floatval($facilityResult->fetch_assoc()['price']);

// -------------------
// Calculate extras
// -------------------
$extrasTotal = 0;
$sanitizedExtras = [];
foreach ($extras as $extra) {
    $eid = intval($extra['id']);
    $qty = intval($extra['quantity']);
    if ($qty <= 0) continue;

    $extraQuery = $conn->prepare("SELECT price, extras FROM extras WHERE extra_id = ?");
    $extraQuery->bind_param("i", $eid);
    $extraQuery->execute();
    $extraResult = $extraQuery->get_result();
    if ($extraResult->num_rows === 0) continue;

    $extraRow = $extraResult->fetch_assoc();
    $line = floatval($extraRow['price']) * $qty * $nights;
    $extrasTotal += $line;

    $sanitizedExtras[] = [
        "id" => $eid,
        "name" => $extraRow['extras'],
        "quantity" => $qty,
        "price" => $extraRow['price']
    ];
}

// -------------------
// Get dynamic holiday charge from settings
// -------------------
$settingQuery = $conn->query("SELECT holiday_charge FROM setting LIMIT 1");
$holidayChargePercent = 0.1; // default 10%
if ($settingQuery && $row = $settingQuery->fetch_assoc()) {
    $holidayChargePercent = floatval($row['holiday_charge']) / 100;
}

// -------------------
// Calculate holiday surcharge (backend only)
// -------------------
$holidayQuery = $conn->query("SELECT date FROM holidays");
$holidays = [];
while ($row = $holidayQuery->fetch_assoc()) {
    $holidays[] = $row['date']; // format: MM/DD
}

$checkInDate = new DateTime($checkIn);
$checkOutDate = new DateTime($checkOut);
$holidayNights = 0;

for ($date = clone $checkInDate; $date < $checkOutDate; $date->modify('+1 day')) {
    $mmdd = $date->format('m/d');
    if (in_array($mmdd, $holidays)) {
        $holidayNights++;
    }
}

// Surcharge = dynamic % of (room + extras per night) × holiday nights
$pricePerNightWithExtras = $baseRoomPrice + ($extrasTotal / max($nights,1));
$holidaySurcharge = $pricePerNightWithExtras * $holidayChargePercent * $holidayNights;

// -------------------
// Compute final totals (database stores only room + extras)
// -------------------
$totalPrice = ($baseRoomPrice * $nights) + $extrasTotal;

// -------------------
// Availability check
// -------------------
$availabilityCheck = $conn->prepare("
    SELECT 1
    FROM room_booking
    WHERE facility_id = ?
      AND status IN ('pending', 'approved', 'arrived', 'rescheduled')
      AND start_date < ?
      AND end_date > ?
    LIMIT 1
");
$availabilityCheck->bind_param("iss", $facilityId, $checkOut, $checkIn);
$availabilityCheck->execute();
$availabilityResult = $availabilityCheck->get_result();
if ($availabilityResult->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "Dates unavailable. Please refresh the page to get the latest updates."
    ]);
    exit;
}

// -------------------
// Insert booking (without holiday surcharge in DB)
// -------------------
$insertBooking = $conn->prepare("
    INSERT INTO room_booking 
    (fullname, phone, facility_id, start_date, end_date, nights, status, price)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
");
$insertBooking->bind_param(
    "ssissid",
    $fullname,
    $phone,
    $facilityId,
    $checkIn,
    $checkOut,
    $nights,
    $totalPrice
);
if (!$insertBooking->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Booking failed"]);
    exit;
}
$bookingId = $insertBooking->insert_id;

// -------------------
// Insert extras
// -------------------
if (!empty($sanitizedExtras)) {
    $ins = $conn->prepare("
        INSERT INTO booking_extras (booking_id, extra_id, name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    ");
    foreach ($sanitizedExtras as $ex) {
        $ins->bind_param("iisid", $bookingId, $ex['id'], $ex['name'], $ex['quantity'], $ex['price']);
        $ins->execute();
    }
}

// -------------------
// Return JSON (include holiday surcharge but NOT stored in DB)
// -------------------
echo json_encode([
    "success" => true,
    "booking_id" => $bookingId,
    "fullname" => $fullname,
    "phone" => $phone,
    "start_date" => $checkIn,
    "end_date" => $checkOut,
    "nights" => $nights,
    "base_price" => $baseRoomPrice * $nights,
    "extras_total" => $extrasTotal,
    "holiday_surcharge" => $holidaySurcharge,
    "holiday_charge_percent" => $holidayChargePercent * 100, // e.g., 10, 15
    "holiday_nights" => $holidayNights,
    "total_price" => $totalPrice + $holidaySurcharge,
    "extras" => $sanitizedExtras
]);
exit;