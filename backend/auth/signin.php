<?php
include("../header.php");
require_once "../dbConn.php";
require_once "../config/jwt.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

$email = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit;
}

try {
    // Use mysqli prepared statement
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($password, $user["password"])) {
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        exit;
    }

    // Generate JWT token
    $payload = [
        "user_id" => $user["user_id"],
        "email" => $user["email"],
        "acc_type" => $user["acc_type"],
        "exp" => time() + (60 * 60 * 4) // 4 hours
    ];

    $jwt = create_jwt($payload); // from jwt.php

    // Safe redirect path
    $redirect = "/";
    if ($user["acc_type"] === "admin") {
        $redirect = "/admin";
    }
/////////////////////////////////////////////////////
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "token" => $jwt,
        "user" => [
            "user_id" => $user["user_id"],
            "firstname" => $user["firstname"],
            "lastname" => $user["lastname"],
            "email" => $user["email"],
            "acc_type" => $user["acc_type"]
        ],
        "redirect" => $redirect
    ]);
    exit;

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    exit;
}
?>
