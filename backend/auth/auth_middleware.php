<?php
/**
 * JWT Authentication Middleware
 */

require_once(__DIR__ . '/../vendor/autoload.php');
require_once(__DIR__ . '/../dbConn.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Load environment variables (use $_ENV not getenv)
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

/**
 * Get Bearer token from Authorization header or request
 */
function get_bearer_token() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

    if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return $matches[1];
    }

    // Fallback: token from query or POST
    return $_REQUEST['token'] ?? null;
}

/**
 * Require authentication (and optional role)
 *
 * @param mysqli $conn
 * @param string|null $requiredRole
 * @return array $user
 */
function require_auth($conn, $requiredRole = null) {
    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "No token provided"]);
        exit;
    }

    $secretKey = $_ENV['JWT_SECRET'] ?? null;
    if (!$secretKey) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Server configuration error (missing JWT_SECRET)"]);
        exit;
    }

    try {
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

        // Extra safety: check expiry manually
        if (isset($decoded->exp) && $decoded->exp < time()) {
            throw new Exception("Token expired");
        }
    } catch (Exception $e) {
        error_log("JWT error: " . $e->getMessage());
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
        exit;
    }

    $userId = $decoded->user_id ?? null;
    if (!$userId) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid token payload"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT user_id, email, acc_type, firstname, lastname FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    $user = $result->fetch_assoc();

    if ($requiredRole && $user['acc_type'] !== $requiredRole) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Forbidden: insufficient permissions"]);
        exit;
    }

    return $user;
}
?>
