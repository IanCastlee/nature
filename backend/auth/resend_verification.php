<?php
include("../dbConn.php");
include("../header.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? "");

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit;
}

// Check if user exists and is not verified
$stmt = $conn->prepare("SELECT user_id, firstname, email_verified FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email not found."]);
    exit;
}

$user = $result->fetch_assoc();

if ($user['email_verified'] == 1) {
    echo json_encode(["success" => false, "message" => "Email already verified."]);
    exit;
}

// Generate new token and expiration (e.g., 24 hours)
$new_token = bin2hex(random_bytes(16));
$expires_at = date("Y-m-d H:i:s", strtotime("+1 day"));

$update = $conn->prepare("UPDATE users SET verification_token = ?, verification_expires_at = ? WHERE user_id = ?");
$update->bind_param("ssi", $new_token, $expires_at, $user['user_id']);
$update->execute();

// Send email
$verify_link = $_ENV['APP_URL'] . "/auth/verify.php?token=" . urlencode($new_token);

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
    $mail->Subject = 'Resend: Verify your email address';
    $mail->Body = "
        <h3>Hello {$user['firstname']},</h3>
        <p>Click below to verify your email:</p>
        <p>
            <a href='$verify_link' target='_blank' style='
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                color: #ffffff;
                background-color: #28a745;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
            '>Verify Email</a>
        </p>
        <br><p>If you didn’t request this, ignore this email.</p>
    ";
    $mail->send();

    echo json_encode(["success" => true, "message" => "Verification email resent. Please check your inbox."]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Failed to send email. Error: " . $mail->ErrorInfo]);
}

$conn->close();
?>
