<?php
header('Content-Type: application/json');

include("../header.php");
include("../dbConn.php"); // $conn as MySQLi connection

if (!isset($conn) || !$conn instanceof mysqli) {
    error_log("Database connection is not properly initialized.");
    http_response_code(500);
    echo json_encode(["error" => "Database connection error"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
}

$old_booking_id = $_POST['booking_id'] ?? null;
$new_booking_id = $_POST['new_booking_id'] ?? null;
$paid = $_POST['paid'] ?? null;
$difference = $_POST['difference'] ?? 0;

$old_status = $_POST['old_status'] ?? 'resched';
$new_status = $_POST['new_status'] ?? 'rescheduled';

if (!$old_booking_id || !$new_booking_id || !is_numeric($paid)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or invalid parameters"]);
    exit;
}

$paid = floatval($paid);
$difference = floatval($difference);

$conn->begin_transaction();

try {
    // Fetch previous booking details
    $stmtPrev = $conn->prepare("
        SELECT rb.fullname, rb.phone, rb.paid AS prev_paid, rb.facility_id, r.room_name, rb.start_date, rb.end_date
        FROM room_booking rb
        LEFT JOIN rooms r ON rb.facility_id = r.room_id
        WHERE rb.booking_id = ?
    ");
    if (!$stmtPrev) throw new Exception($conn->error);
    $stmtPrev->bind_param("i", $old_booking_id);
    $stmtPrev->execute();
    $resultPrev = $stmtPrev->get_result();
    if ($resultPrev->num_rows === 0) throw new Exception("Old booking not found");
    $oldBooking = $resultPrev->fetch_assoc();
    $stmtPrev->close();

    // Fetch new booking details
    $stmtNew = $conn->prepare("
        SELECT rb.price AS new_price, rb.facility_id, r.room_name, rb.start_date, rb.end_date
        FROM room_booking rb
        LEFT JOIN rooms r ON rb.facility_id = r.room_id
        WHERE rb.booking_id = ?
    ");
    if (!$stmtNew) throw new Exception($conn->error);
    $stmtNew->bind_param("i", $new_booking_id);
    $stmtNew->execute();
    $resultNew = $stmtNew->get_result();
    if ($resultNew->num_rows === 0) throw new Exception("New booking not found");
    $newBooking = $resultNew->fetch_assoc();
    $stmtNew->close();

    // Update old booking status
    $stmt1 = $conn->prepare("UPDATE room_booking SET status = ? WHERE booking_id = ?");
    if (!$stmt1) throw new Exception($conn->error);
    $stmt1->bind_param("si", $old_status, $old_booking_id);
    $stmt1->execute();
    if ($stmt1->affected_rows === 0) throw new Exception("Failed to update old booking");
    $stmt1->close();

    // Update new booking details
    $stmt2 = $conn->prepare("
        UPDATE room_booking
        SET status = ?,
            paid = ?,
            down_payment = ?,
            refund_charge = ?
        WHERE booking_id = ?
    ");
    if (!$stmt2) throw new Exception($conn->error);
    $stmt2->bind_param("sdddi", $new_status, $paid, $paid, $difference, $new_booking_id);
    $stmt2->execute();
    if ($stmt2->affected_rows === 0) throw new Exception("Failed to update new booking");
    $stmt2->close();

    // Prepare prev_check_in_out and new_check_in_out strings
    $prev_check_in_out = $oldBooking['start_date'] . " to " . $oldBooking['end_date'];
    $new_check_in_out = $newBooking['start_date'] . " to " . $newBooking['end_date'];

    // Insert into reschedule_log
    $inserted_at = date("Y-m-d H:i:s");
    $stmtLog = $conn->prepare("
        INSERT INTO reschedule_log (
            guest,
            phone,
            previous_room,
            previous_paid,
            prev_check_in_out,
            new_room,
            new_paid,
            new_check_in_out,
            refund_recharge,
            inserted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    if (!$stmtLog) throw new Exception($conn->error);
    $stmtLog->bind_param(
        "sssdssdsss",
        $oldBooking['fullname'],
        $oldBooking['phone'],
        $oldBooking['room_name'],
        $oldBooking['prev_paid'],
        $prev_check_in_out,
        $newBooking['room_name'],
        $paid,
        $new_check_in_out,
        $difference,
        $inserted_at
    );
    $stmtLog->execute();
    $stmtLog->close();

    $conn->commit();

    echo json_encode(["success" => true, "message" => "Booking rescheduled successfully"]);
} catch (Exception $e) {
    $conn->rollback();
    error_log("Booking reschedule error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
