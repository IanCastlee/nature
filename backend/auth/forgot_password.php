<?php
include("../header.php");
include("../dbConn.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../vendor/autoload.php';

header("Content-Type: application/json");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// --- Handle input (JSON or FormData) ---
$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput, true);

$email = "";
if (!empty($input['email'])) {
    $email = trim($input['email']);
} elseif (isset($_POST['email'])) {
    $email = trim($_POST['email']);
}

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit;
}

// --- Check if user exists ---
$stmt = $conn->prepare("SELECT user_id, firstname FROM users WHERE email = ? LIMIT 1");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email not found."]);
    exit;
}

$user = $result->fetch_assoc();

// --- Generate reset token and expiration ---
$reset_token = bin2hex(random_bytes(16));
$expires_at = date("Y-m-d H:i:s", strtotime("+1 hour"));

// --- Store token in DB ---
$update = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires_at = ? WHERE user_id = ?");
if (!$update) {
    echo json_encode(["success" => false, "message" => "Database update failed."]);
    exit;
}
$update->bind_param("ssi", $reset_token, $expires_at, $user['user_id']);
$update->execute();

// --- Build password reset link (frontend URL) ---
// Make sure this points to your React app, e.g., localhost:5173 for dev
$frontendUrl = $_ENV['FRONTEND_URL'] ?? "http://localhost:5173";
$reset_link = rtrim($frontendUrl, '/') . "/reset-password?token=" . urlencode($reset_token);

// --- Send email using PHPMailer ---
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
        <br><p>If you didn’t request this, you can safely ignore this email.</p>
    ";
    $mail->send();

echo json_encode([
    "success" => true,
    "message" => "Check your email inbox. If you don't see it, also check your spam or junk folder."
]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Failed to send email. Error: " . $mail->ErrorInfo]);
}

$conn->close();
?>
