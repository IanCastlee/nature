<?php
include("../header.php");
include("../dbConn.php");
require_once("../auth/auth_middleware.php");

header('Content-Type: application/json');

// Check DB connection
if (!isset($conn) || !$conn instanceof mysqli) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection error"]);
    exit;
}

try {
    $sql = "SELECT * FROM reschedule_log_fh ORDER BY inserted_at DESC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception($conn->error);
    }

    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $logs
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to fetch reschedule logs: " . $e->getMessage()
    ]);
}
