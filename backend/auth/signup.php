<?php
include("../header.php"); // If needed for CORS or headers
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Handle raw JSON if sent (optional support)
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if ($method === 'POST') {
    $fullname = trim($_POST['fullname'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $action = $_POST['action'] ?? '';

    // Basic validation
    if (empty($fullname) || empty($phone) || empty($address) || empty($email) || empty($password)) {
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

    // Check if email already exists
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email already exists."]);
        exit;
    }
    $stmt->close();

    // Hash password securely
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Generate a random verification token (e.g. 32 chars)
    $verification_token = bin2hex(random_bytes(16));

    // Insert into database with email_verified = 0 and token
    $stmt = $conn->prepare("INSERT INTO users (fullname, phone, address, email, password, email_verified, verification_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, NOW(), NOW())");
    $stmt->bind_param("ssssss", $fullname, $phone, $address, $email, $hashedPassword, $verification_token);

    if ($stmt->execute()) {
        // Optionally, you can send verification email here with the token
        echo json_encode(["success" => true, "message" => "Account created successfully. Please verify your email."]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
