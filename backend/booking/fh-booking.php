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
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id"]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE other_facilities_booking
        SET status = 'approved',
            paid = price / 2
        WHERE id = ?
    ");
    $stmt->bind_param("i", $id);

    echo $stmt->execute()
        ? json_encode(["success" => true, "message" => "Booking approved."])
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
        UPDATE other_facilities_booking SET status = 'pending', paid = 0 WHERE id = ?
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
            paid = price / 2
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

// Check facility info
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
$price        = $facility['price'];

// Check for time conflict
$conflict = $conn->prepare("
    SELECT * FROM other_facilities_booking 
    WHERE facility_type = ? AND date = ?
    AND (
        (start_time < ? AND end_time > ?) OR
        (start_time >= ? AND start_time < ?)
    )
");
$conflict->bind_param("ssssss", $facilityType, $date, $endTime, $startTime, $startTime, $endTime);
$conflict->execute();
$conflictRes = $conflict->get_result();

if ($conflictRes->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "This time slot is already booked."
    ]);
    exit;
}

// Insert booking
$insert = $conn->prepare("
    INSERT INTO other_facilities_booking (fullname, phone, facility_id, facility_type, date, start_time, end_time, price, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$insert->bind_param(
    "ssisssiss",
    $fullname, $phone, $fhId, $facilityType,
    $date, $startTime, $endTime,
    $price, $createdAt
);

if ($insert->execute()) {
    $booking_id = $insert->insert_id; // <--- GET NEW ID

    //  RETURN FULL SUMMARY for your React modal
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
        "base_price" => $price,
        "total_price" => $price,
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
