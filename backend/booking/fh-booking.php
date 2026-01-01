<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Allow JSON input
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

$action = $_POST['action'] ?? 'create';
$id = $_POST['id'] ?? null;

/**
 * ========================================================
 *  APPROVE BOOKING
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
    $stmt = $conn->prepare("SELECT price FROM other_facilities_booking WHERE id = ?");
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
    $paid = round($price / 2, 2); // 1499.50
    $down = $paid;
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
        UPDATE other_facilities_booking
        SET 
            status = 'approved',
            paid = ?,
            down_payment = ?
        WHERE id = ?
    ");
    $stmt->bind_param("ddi", $paid, $down, $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Booking approved"])
        : json_encode(["success" => false, "message" => $stmt->error]);

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
        UPDATE other_facilities_booking 
        SET status = 'arrived', 
            paid = price 
        WHERE id = ?
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
        UPDATE other_facilities_booking SET status = 'pending', paid = 0, down_payment = 0 WHERE id = ?
    ");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to update booking"]);
        exit;
    }

    $userStmt = $conn->prepare("SELECT user_id FROM other_facilities_booking WHERE id = ?");
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
        UPDATE other_facilities_booking 
        SET status = 'approved',
            paid = down_payment
        WHERE id = ?
    ");
    $stmt->bind_param("i", $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Booking moved back to approved."])
        : json_encode(["success" => false, "message" => $stmt->error]);

    exit;
}


/**---------------------------------------------------------
 * 2. DECLINE BOOKING + INSERT NOTE
 *--------------------------------------------------------*/
if ($action === "set_decline" || $action === "set_declined") {

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $note = trim($_POST['note'] ?? "");
    if ($note === "") {
        http_response_code(400);
        echo json_encode(["error" => "Decline note is required."]);
        exit;
    }

    $conn->begin_transaction();
    try {
        // 1. Check booking exists
        $getBooking = $conn->prepare("SELECT id FROM other_facilities_booking WHERE id = ?");
        $getBooking->bind_param("i", $id);
        $getBooking->execute();
        $res = $getBooking->get_result();

        if ($res->num_rows === 0) throw new Exception("Booking not found.");

        // 2. Update booking status
        $stmt = $conn->prepare("UPDATE other_facilities_booking SET status = 'declined' WHERE id = ?");
        $stmt->bind_param("i", $id);
        if (!$stmt->execute()) throw new Exception($stmt->error);

        // 3. Insert decline note
        $noteStmt = $conn->prepare("INSERT INTO booking_note_fh (booking_id, note) VALUES (?, ?)");
        $noteStmt->bind_param("is", $id, $note);
        if (!$noteStmt->execute()) throw new Exception("Booking declined but note failed to save.");

        $conn->commit();

        echo json_encode(["success" => true, "message" => "Booking declined and note saved."]);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

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

    // Update status to 'not_attended'
    $stmt = $conn->prepare("
        UPDATE other_facilities_booking 
        SET status = 'not_attended' 
        WHERE id = ?
    ");
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to update booking status: " . $stmt->error
        ]);
        exit;
    }

    // Optional: Notify user that the booking was marked as not attended
    $userStmt = $conn->prepare("SELECT user_id FROM other_facilities_booking WHERE id = ?");
    $userStmt->bind_param("i", $id);
    $userStmt->execute();
    $userResult = $userStmt->get_result();

    if ($userResult->num_rows > 0) {
        $userId = $userResult->fetch_assoc()['user_id'];
        $message = trim($_POST['reason'] ?? "Your booking was marked as Not Attended.");
        $from = 'admin';

        $notifStmt = $conn->prepare("
            INSERT INTO notifications (`from_`, `to_`, `message`, `is_read`, `created_at`)
            VALUES (?, ?, ?, 0, NOW())
        ");
        $notifStmt->bind_param("sis", $from, $userId, $message);
        $notifStmt->execute();
    }

    echo json_encode([
        "success" => true,
        "message" => "Booking marked as Not Attended."
    ]);

    exit;
}


/**---------------------------------------------------------
 * 3. CREATE BOOKING (MAIN PART)
 *--------------------------------------------------------*/

$fhId      = $_POST['fhId'] ?? null;
$fullname  = $_POST['fullname'] ?? null;
$phone     = $_POST['phone'] ?? null;
$date      = $_POST['date'] ?? null;
$startTime = $_POST['startTime'] ?? null;
$endTime   = $_POST['endTime'] ?? null;
$createdAt = date("Y-m-d H:i:s");

// Validation
if (!$fullname || !$phone || !$fhId || !$date || !$startTime || !$endTime) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);
    exit;
}

// -------------------
// Get facility info
// -------------------
$stmt = $conn->prepare("SELECT name, price FROM function_hall WHERE fh_id = ?");
$stmt->bind_param("i", $fhId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Function Hall not found."
    ]);
    exit;
}

$facility = $result->fetch_assoc();
$facilityType = $facility['name'];
$basePrice    = floatval($facility['price']);

// -------------------
// DATE-ONLY CONFLICT CHECK
// -------------------
$conflict = $conn->prepare("
    SELECT 1
    FROM other_facilities_booking
    WHERE facility_id = ?
    AND status IN ('pending', 'approved', 'arrived', 'rescheduled')
      AND date = ?
    LIMIT 1
");

$conflict->bind_param("is", $fhId, $date);
$conflict->execute();
$conflictRes = $conflict->get_result();

if ($conflictRes->num_rows > 0) {
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "This date is already booked. Please refresh the page to see the latest availability."
    ]);
    exit;
}

// -------------------
// 🔹 GET HOLIDAY CHARGE PERCENT (DYNAMIC)
// -------------------
$settingQuery = $conn->query("SELECT holiday_charge FROM setting LIMIT 1");
$holidayChargePercent = 0.0;

if ($settingQuery && $row = $settingQuery->fetch_assoc()) {
    $holidayChargePercent = floatval($row['holiday_charge']) / 100;
}

// -------------------
// 🔹 CHECK IF DATE IS HOLIDAY
// -------------------
$holidayQuery = $conn->query("SELECT date FROM holidays");
$holidays = [];

while ($row = $holidayQuery->fetch_assoc()) {
    $holidays[] = $row['date']; // MM/DD
}

$isHoliday = false;
$bookingDate = DateTime::createFromFormat("Y-m-d", $date);
$mmdd = $bookingDate->format("m/d");

if (in_array($mmdd, $holidays)) {
    $isHoliday = true;
}

// -------------------
// 🔹 CALCULATE HOLIDAY SURCHARGE
// -------------------
$holidaySurcharge = $isHoliday
    ? $basePrice * $holidayChargePercent
    : 0;

// -------------------
// FINAL TOTAL (NOT STORED IN DB)
// -------------------
$totalPrice = $basePrice + $holidaySurcharge;

// -------------------
// INSERT BOOKING (WITHOUT SURCHARGE)
// -------------------
$insert = $conn->prepare("
    INSERT INTO other_facilities_booking 
    (fullname, phone, facility_id, facility_type, date, start_time, end_time, price, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$insert->bind_param(
    "ssisssiss",
    $fullname,
    $phone,
    $fhId,
    $facilityType,
    $date,
    $startTime,
    $endTime,
    $basePrice,
    $createdAt
);

if ($insert->execute()) {
    $booking_id = $insert->insert_id;

    echo json_encode([
        "success" => true,
        "message" => "Booking successful!",
        "booking_id" => $booking_id,
        "fullname" => $fullname,
        "phone" => $phone,
        "fhId" => $fhId,
        "facility_type" => $facilityType,
        "date" => $date,
        "start_time" => $startTime,
        "end_time" => $endTime,

        // 🔹 PRICE BREAKDOWN
        "base_price" => $basePrice,
        "holiday_applied" => $isHoliday,
        "holiday_charge_percent" => $holidayChargePercent * 100,
        "holiday_surcharge" => $holidaySurcharge,
        "total_price" => $totalPrice,

        "extras_total" => 0,
        "extras" => [],
        "created_at" => $createdAt
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to insert booking."
    ]);
}
