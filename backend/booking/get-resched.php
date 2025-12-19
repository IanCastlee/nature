<?php
include("../header.php");
include("../dbConn.php");
require_once("../auth/auth_middleware.php"); 

header('Content-Type: application/json');

// Authenticate user
$user = require_auth($conn); 

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    // ===============================
    // Fetch all reschedule logs
    // ===============================
    $stmt = $conn->prepare("
        SELECT id, fullname, phone, prev_room, new_room, sched_date, resched_to, 
               sched_total_price, resched_total_price, sched_paid_payment, resched_paid_payment, rescheduled_booking_id,
               refund_charge, created_at, updated_at
        FROM resched_log
        ORDER BY updated_at DESC
    ");
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $logs = [];
        while ($row = $result->fetch_assoc()) {
            $logs[] = $row;
        }
        echo json_encode([
            "success" => true,
            "data" => $logs
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Only GET method is allowed"
    ]);
}

exit;
?>
