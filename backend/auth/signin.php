<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Allow only POST
if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

// Optional: handle JSON request body
if (strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

// Sanitize inputs
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Check required fields
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required."
    ]);
    exit;
}

// Query user
$stmt = $conn->prepare("SELECT user_id, fullname, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "No account found with that email."
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Incorrect password."
    ]);
    exit;
}

// Success
echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "user" => [
        "id" => $user['user_id'],
        "fullname" => $user['fullname'],
        "email" => $user['email'],
    ],
    "token" => "your-auth-token" // Replace with JWT or session token
]);
exit;
