<?php
include("../header.php");
include("../dbConn.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if ($method === 'POST') {
    $firstname = trim($_POST['firstname'] ?? '');
    $lastname = trim($_POST['lastname'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // ✅ Basic validation
    if (empty($firstname) || empty($lastname) || empty($phone) || empty($address) || empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Invalid email address."]);
        exit;
    }

    if (!preg_match('/^\d{10,}$/', $phone)) {
        echo json_encode(["success" => false, "message" => "Invalid phone number."]);
        exit;
    }

    if (!preg_match('/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/', $password)) {
        echo json_encode(["success" => false, "message" => "Password must be at least 8 characters and include a special character."]);
        exit;
    }

    // ✅ Check if email already exists
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email already exists."]);
        exit;
    }
    $stmt->close();

    // ✅ Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // ✅ Generate verification token + expiration
    $verification_token = bin2hex(random_bytes(16));
    $verification_expires_at = date("Y-m-d H:i:s", strtotime("+1 day")); // expires in 24 hours

    // ✅ Insert user with token expiration
    $stmt = $conn->prepare("
        INSERT INTO users (firstname, lastname, phone, address, email, password, email_verified, verification_token, verification_expires_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())
    ");
    $stmt->bind_param("ssssssss", $firstname, $lastname, $phone, $address, $email, $hashedPassword, $verification_token, $verification_expires_at);

    if ($stmt->execute()) {
        // ✅ Send verification email
        $verify_link = $_ENV['APP_URL'] . "/auth/verify.php?token=" . urlencode($verification_token);

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
            $mail->addAddress($email, $firstname);

            $mail->isHTML(true);
            $mail->Subject = 'Verify your email address';
            $mail->Body = "
                <h3>Hello $firstname,</h3>
                <p>Thank you for signing up!</p>
                <p>Please verify your email by clicking the button below (link expires in 24 hours):</p>
                <p>
                    <a href='$verify_link' target='_blank' style=\"
                        display: inline-block;
                        padding: 12px 24px;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #28a745;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: bold;
                    \">Verify Email</a>
                </p>
                <br><p>If you didn’t create this account, you can ignore this email.</p>
            ";

            $mail->send();

            echo json_encode([
                "success" => true,
                "message" => "Account created successfully. Please check your email to verify your account.",
                "email" => $email,
                "token" => $verification_token,
                "expires_at" => $verification_expires_at
            ]);

        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => "Account created, but failed to send verification email. Error: " . $mail->ErrorInfo
            ]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Database error."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
