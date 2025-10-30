<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

header("Content-Type: application/json");

// Accept raw JSON input
$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? "");

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT user_id, firstname FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email not found."]);
    exit;
}

$user = $result->fetch_assoc();

// Generate reset token and expiration
$reset_token = bin2hex(random_bytes(16));
$expires_at = date("Y-m-d H:i:s", strtotime("+1 hour"));

// Store token in DB
$update = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE user_id = ?");
$update->bind_param("ssi", $reset_token, $expires_at, $user['user_id']);
$update->execute();

// Make sure your APP_URL ends without a trailing slash in your .env file
$reset_link = rtrim($_ENV['APP_URL'], '/') . "/auth/reset_password.php?token=" . urlencode($reset_token);

// Send email using PHPMailer
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $_ENV['MAIL_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['MAIL_USERNAME'];
    $mail->Password   = $_ENV['MAIL_PASSWORD'];
    $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'];
    $mail->Port       = $_ENV['MAIL_PORT'];

    $mail->setFrom($_ENV['MAIL_FROM_ADDRESS'], $_ENV['MAIL_FROM_NAME']);
    $mail->addAddress($email, $user['firstname']);

    $mail->isHTML(true);
    $mail->Subject = 'Reset your password';
    $mail->Body = "
        <h3>Hello {$user['firstname']},</h3>
        <p>You requested to reset your password. Click the button below:</p>
        <p>
            <a href='$reset_link' target='_blank' style='
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
            '>Reset Password</a>
        </p>
        <br><p>If you didn’t request this, ignore this email.</p>
    ";
    $mail->send();

    echo json_encode(["success" => true, "message" => "Check your inbox for the reset link."]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Failed to send email. Error: " . $mail->ErrorInfo]);
}

$conn->close();
?>
