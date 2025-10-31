<?php
include("../header.php");
include("../dbConn.php");

// Ensure JSON response
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

// Accept FormData or JSON
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if (!isset($_POST['token'], $_POST['password'])) {
    echo json_encode(["success" => false, "message" => "Token and password are required."]);
    exit;
}

$token = $_POST['token'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// --- Check token validity ---
$stmt = $conn->prepare("SELECT user_id, reset_expires_at FROM users WHERE reset_token = ? LIMIT 1");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Invalid token."]);
    exit;
}

$row = $result->fetch_assoc();
if (strtotime($row['reset_expires_at']) < time()) {
    echo json_encode(["success" => false, "message" => "Token expired."]);
    exit;
}

// --- Update password and clear token ---
$update = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE user_id = ?");
if (!$update) {
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}
$update->bind_param("si", $password, $row['user_id']);
$update->execute();

echo json_encode(["success" => true, "message" => "Password has been reset. You can now sign in."]);
?>
