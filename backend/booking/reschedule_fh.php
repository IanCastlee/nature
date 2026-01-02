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

// Extract inputs
$old_booking_id = $_POST['booking_id'] ?? null;
$new_booking_id = $_POST['new_booking_id'] ?? null;
$paid = $_POST['paid'] ?? null;
$difference = $_POST['difference'] ?? 0;

$old_status = $_POST['old_status'] ?? 'resched';
$new_status = $_POST['new_status'] ?? 'rescheduled';

// Validate inputs
if (!$old_booking_id || !$new_booking_id || !is_numeric($paid) || !is_numeric($difference)) {
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
        SELECT ofb.fullname, ofb.phone, ofb.paid AS prev_paid, ofb.facility_id, fh.name AS facility_name, ofb.date
        FROM other_facilities_booking ofb
        LEFT JOIN function_hall fh ON ofb.facility_id = fh.fh_id
        WHERE ofb.id = ?
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
        SELECT ofb.price AS new_price, ofb.facility_id, fh.name AS facility_name, ofb.date
        FROM other_facilities_booking ofb
        LEFT JOIN function_hall fh ON ofb.facility_id = fh.fh_id
        WHERE ofb.id = ?
    ");
    if (!$stmtNew) throw new Exception($conn->error);
    $stmtNew->bind_param("i", $new_booking_id);
    $stmtNew->execute();
    $resultNew = $stmtNew->get_result();
    if ($resultNew->num_rows === 0) throw new Exception("New booking not found");
    $newBooking = $resultNew->fetch_assoc();
    $stmtNew->close();

    // Update old booking status
    $stmt1 = $conn->prepare("UPDATE other_facilities_booking SET status = ? WHERE id = ?");
    if (!$stmt1) throw new Exception($conn->error);
    $stmt1->bind_param("si", $old_status, $old_booking_id);
    $stmt1->execute();
    if ($stmt1->affected_rows === 0) throw new Exception("Failed to update old booking");
    $stmt1->close();

    // Update new booking details
    $stmt2 = $conn->prepare("
        UPDATE other_facilities_booking
        SET status = ?,
            paid = ?,
            down_payment = ?,
            refund_charge = ?
        WHERE id = ?
    ");
    if (!$stmt2) throw new Exception($conn->error);
    $stmt2->bind_param("sdddi", $new_status, $paid, $paid, $difference, $new_booking_id);
    $stmt2->execute();
    if ($stmt2->affected_rows === 0) throw new Exception("Failed to update new booking");
    $stmt2->close();

    // Insert into reschedule_log_fh
    $inserted_at = date("Y-m-d H:i:s");
    $stmtLog = $conn->prepare("
        INSERT INTO reschedule_log_fh (
            guest,
            phone,
            previous_facility,
            previous_paid,
            prev_date,
            new_facility,
            new_paid,
            new_date,
            refund_recharge,
            inserted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    if (!$stmtLog) throw new Exception($conn->error);
    $stmtLog->bind_param(
        "sssdssdsss",
        $oldBooking['fullname'],
        $oldBooking['phone'],
        $oldBooking['facility_name'],
        $oldBooking['prev_paid'],
        $oldBooking['date'],
        $newBooking['facility_name'],
        $paid,
        $newBooking['date'],
        $difference,
        $inserted_at
    );
    $stmtLog->execute();
    $stmtLog->close();

    $conn->commit();

    echo json_encode(["success" => true, "message" => "Booking rescheduled successfully"]);
    exit;
} catch (Exception $e) {
    $conn->rollback();
    error_log("Booking reschedule FH error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    exit;
}
