<?php
include("../header.php");
include("../dbConn.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

// Accept JSON
if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

$booking_id       = $_POST["booking_id"] ?? null;
$prev_booking_id  = $_POST["prev_booking_id"] ?? null; // 🔥 NEW
$status           = $_POST["status"] ?? null;
$difference       = $_POST["difference"] ?? 0;

if (!$booking_id || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Missing booking_id or status"]);
    exit;
}

$response = [];

/*==============================================
 UPDATE CURRENT BOOKING
===============================================*/

switch ($status) {

    case "resched": // OLD booking
        $stmt = $conn->prepare("
            UPDATE other_facilities_booking
            SET status = 'resched',
                refund_charge = ?
            WHERE id = ?
        ");
        $stmt->bind_param("di", $difference, $booking_id);
        break;

    case "rescheduled": // NEW booking
        $stmt = $conn->prepare("
            UPDATE other_facilities_booking
            SET status = 'rescheduled',
                paid = price / 2,
                refund_charge = ?
            WHERE id = ?
        ");
        $stmt->bind_param("di", $difference, $booking_id);
        break;

    default:
        $stmt = $conn->prepare("
            UPDATE other_facilities_booking
            SET status = ?
            WHERE id = ?
        ");
        $stmt->bind_param("si", $status, $booking_id);
        break;
}

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "error" => $stmt->error]);
    exit;
}

$response["success"] = true;

// If OLD booking updated → finish
if ($status === "resched") {
    echo json_encode([
        "success" => true,
        "message" => "Previous booking updated."
    ]);
    exit;
}

/*==============================================
 INSERT LOG (for NEW booking only)
===============================================*/

if ($status === "rescheduled") {

    if (!$prev_booking_id) {
        echo json_encode(["success" => false, "error" => "Missing prev_booking_id"]);
        exit;
    }

    // Fetch OLD booking using prev_booking_id
    $prev_stmt = $conn->prepare("
        SELECT ofb.*, fh.name AS facility_name
        FROM other_facilities_booking ofb
        JOIN function_hall fh ON fh.fh_id = ofb.facility_id
        WHERE ofb.id = ?
        LIMIT 1
    ");
    $prev_stmt->bind_param("i", $prev_booking_id);
    $prev_stmt->execute();
    $prev_booking = $prev_stmt->get_result()->fetch_assoc();

    // Fetch NEW booking
    $new_stmt = $conn->prepare("
        SELECT ofb.*, fh.name AS facility_name
        FROM other_facilities_booking ofb
        JOIN function_hall fh ON fh.fh_id = ofb.facility_id
        WHERE ofb.id = ?
        LIMIT 1
    ");
    $new_stmt->bind_param("i", $booking_id);
    $new_stmt->execute();
    $new_booking = $new_stmt->get_result()->fetch_assoc();

    if (!$prev_booking || !$new_booking) {
        echo json_encode(["success" => false, "error" => "Record lookup failed."]);
        exit;
    }

    // Insert into log
    $insert_stmt = $conn->prepare("
        INSERT INTO resched_log_fh
        (fullname, phone, prev_facility, new_facility, sched_date, resched_date,
         sched_time, resched_time, sched_total_price, resched_total_price,
         sched_paid_payment, resched_paid_payment, refund_charge,
         rescheduled_booking_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    $fullname   = $new_booking['fullname'];
    $phone      = $new_booking['phone'];

    $prev_fac   = $prev_booking['facility_name'];
    $new_fac    = $new_booking['facility_name'];

    $sched_date   = $prev_booking['date'];
    $resched_date = $new_booking['date'];

    $sched_time   = $prev_booking['start_time'] . " to " . $prev_booking['end_time'];
    $resched_time = $new_booking['start_time'] . " to " . $new_booking['end_time'];

    $sched_total_price   = $prev_booking['price'];
    $resched_total_price = $new_booking['price'];

    $sched_paid_payment   = $prev_booking['paid'];
    $resched_paid_payment = $new_booking['paid'];

    $refund_charge = $prev_booking['refund_charge'];
    $rescheduled_id = $new_booking['id'];

    $insert_stmt->bind_param(
        "ssssssssdddddi",
        $fullname, $phone, $prev_fac, $new_fac,
        $sched_date, $resched_date, $sched_time, $resched_time,
        $sched_total_price, $resched_total_price,
        $sched_paid_payment, $resched_paid_payment,
        $refund_charge, $rescheduled_id
    );

    if ($insert_stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Reschedule log created."]);
    } else {
        echo json_encode(["success" => false, "error" => $insert_stmt->error]);
    }

    exit;
}

echo json_encode($response);
exit;
?>
