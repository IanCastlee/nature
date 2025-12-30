<?php
include("../header.php");
include("../dbConn.php");

header('Content-Type: application/json');

// ===============================
// Only POST allowed
// ===============================
if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

// ===============================
// Accept JSON input
// ===============================
if (
    isset($_SERVER["CONTENT_TYPE"]) &&
    strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false
) {
    $_POST = json_decode(file_get_contents("php://input"), true);
}

// ===============================
// Validate inputs
// ===============================
$booking_id       = isset($_POST["booking_id"]) ? intval($_POST["booking_id"]) : null;
$prev_booking_id  = isset($_POST["prev_booking_id"]) ? intval($_POST["prev_booking_id"]) : null;
$status           = $_POST["status"] ?? null;
$difference       = isset($_POST["difference"]) ? floatval($_POST["difference"]) : 0;
$new_half       = isset($_POST["new_half"]) ? floatval($_POST["new_half"]) : 0;

if (!$booking_id || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Missing booking_id or status"]);
    exit;
}

// ===============================
// Start TRANSACTION (IMPORTANT)
// ===============================
$conn->begin_transaction();

try {

    // ===============================
    // Update booking status
    // ===============================
    if ($status === "resched") {

        $stmt = $conn->prepare("
            UPDATE room_booking
            SET status = 'resched',
                refund_charge = ?
            WHERE booking_id = ?
        ");
        $stmt->bind_param("di", $difference, $booking_id);

    } elseif ($status === "rescheduled") {

        $stmt = $conn->prepare("
            UPDATE room_booking
            SET status = 'rescheduled',
                paid = ?,
                down_payment = ?,
                refund_charge = ?
            WHERE booking_id = ?
        ");
        $stmt->bind_param("dddi", $new_half, $new_half, $difference, $booking_id);

    } else {

        $stmt = $conn->prepare("
            UPDATE room_booking
            SET status = ?
            WHERE booking_id = ?
        ");
        $stmt->bind_param("si", $status, $booking_id);
    }

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    // ===============================
    // ONLY create log when FINAL step
    // ===============================
    if ($status === "rescheduled") {

        if (!$prev_booking_id) {
            throw new Exception("Missing prev_booking_id");
        }

        // ===============================
        // Get PREVIOUS booking (EXACT ID)
        // ===============================
        $prev_stmt = $conn->prepare("
            SELECT rb.*, r.room_name
            FROM room_booking rb
            JOIN rooms r ON r.room_id = rb.facility_id
            WHERE rb.booking_id = ?
        ");
        $prev_stmt->bind_param("i", $prev_booking_id);
        $prev_stmt->execute();
        $prev_booking = $prev_stmt->get_result()->fetch_assoc();

        // ===============================
        // Get NEW booking
        // ===============================
        $new_stmt = $conn->prepare("
            SELECT rb.*, r.room_name
            FROM room_booking rb
            JOIN rooms r ON r.room_id = rb.facility_id
            WHERE rb.booking_id = ?
        ");
        $new_stmt->bind_param("i", $booking_id);
        $new_stmt->execute();
        $new_booking = $new_stmt->get_result()->fetch_assoc();

        if (!$prev_booking || !$new_booking) {
            throw new Exception("Previous or new booking not found");
        }

        // ===============================
        // Insert into resched_log
        // ===============================
        $insert_stmt = $conn->prepare("
            INSERT INTO resched_log
            (
                fullname,
                phone,
                prev_room,
                new_room,
                sched_date,
                resched_to,
                sched_total_price,
                resched_total_price,
                sched_paid_payment,
                resched_paid_payment,
                refund_charge,
                rescheduled_booking_id,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        $sched_date  = $prev_booking['start_date'] . " to " . $prev_booking['end_date'];
        $resched_to  = $new_booking['start_date'] . " to " . $new_booking['end_date'];

        $insert_stmt->bind_param(
            "ssssssdddddi",
            $new_booking['fullname'],
            $new_booking['phone'],
            $prev_booking['room_name'],
            $new_booking['room_name'],
            $sched_date,
            $resched_to,
            $prev_booking['price'],
            $new_booking['price'],
            $prev_booking['paid'],
            $new_booking['paid'],
            $difference,
            $booking_id
        );

        if (!$insert_stmt->execute()) {
            throw new Exception($insert_stmt->error);
        }
    }

    // ===============================
    // COMMIT transaction
    // ===============================
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Booking rescheduled successfully"
    ]);

} catch (Exception $e) {

    // ===============================
    // ROLLBACK on error
    // ===============================
    $conn->rollback();

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit;
