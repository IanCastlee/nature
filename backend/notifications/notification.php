<?php
include("../header.php");
include("../dbConn.php");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST allowed"]);
    exit;
}

// Accept raw JSON input
if (strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

$from = intval($_POST['from_'] ?? 12);
$to = intval($_POST['user_id'] ?? 0);
$message = $_POST['message'] ?? '';
$is_read = 0;

if (!$to || !$message) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO notifications (from_, to_, message, is_read, created_at) VALUES (?, ?, ?, ?, NOW())");
$stmt->bind_param("iisi", $from, $to, $message, $is_read);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "notif_id" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}
exit;
