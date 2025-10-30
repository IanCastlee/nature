<?php
include("../dbConn.php");
header("Content-Type: application/json");

if (!isset($_POST['token'], $_POST['password'])) {
    echo json_encode(["success" => false, "message" => "Token and password are required."]);
    exit;
}

$token = $_POST['token'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// Check if token is valid and not expired
$stmt = $conn->prepare("SELECT id, reset_expires_at FROM users WHERE reset_token = ? LIMIT 1");
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

// Update password and invalidate token
$update = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires_at = NULL WHERE id = ?");
$update->bind_param("si", $password, $row['id']);
$update->execute();

echo json_encode(["success" => true, "message" => "Password has been reset. You can now sign in."]);
?>
