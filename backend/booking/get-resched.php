<?php
include("../header.php");
include("../dbConn.php");
require_once("../auth/auth_middleware.php");

header('Content-Type: application/json');

if (!isset($conn) || !$conn instanceof mysqli) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection error"]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT
            id,
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
        FROM reschedule_log
        ORDER BY inserted_at DESC
    ");

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    $stmt->close();

    echo json_encode([
        "success" => true,
        "data" => $logs
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
