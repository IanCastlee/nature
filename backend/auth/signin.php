<?php
include("../header.php");
include("../dbConn.php");

// Require Composer autoload (adjust path if needed)
require_once('../vendor/autoload.php');

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

// Load environment variables from .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$secretKey = $_ENV['JWT_SECRET'] ?? null;
if (!$secretKey) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "JWT secret key is not set. Contact administrator."
    ]);
    exit;
}

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
$stmt = $conn->prepare("SELECT user_id, firstname, lastname, email, password, acc_type FROM users WHERE email = ?");
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

// JWT Configuration
$issuedAt = time();
$expirationTime = $issuedAt + 3600; 

$payload = [
    "iat" => $issuedAt,
    "exp" => $expirationTime,
    "user_id" => $user['user_id'],
    "email" => $user['email'],
    "acc_type" => $user['acc_type'] 
];

// Generate JWT
$jwt = JWT::encode($payload, $secretKey, 'HS256');

// Success Response
echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "user" => [
        "id" => $user['user_id'],
        "firstname" => $user['firstname'],
        "lastname" => $user['lastname'],
        "email" => $user['email'],
        "acc_type" => $user['acc_type']
    ],
    "token" => $jwt
]);
exit;
