<?php
require_once __DIR__ . '/../vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

/**
 * Get Authorization header
 */
function get_authorization_header() {
    if (isset($_SERVER['Authorization'])) return trim($_SERVER["Authorization"]);
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) return trim($_SERVER["HTTP_AUTHORIZATION"]);
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                return trim($value);
            }
        }
    }
    return null;
}

/**
 * Extract Bearer token
 */
function get_bearer_token() {
    $header = get_authorization_header();
    if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
        return $matches[1];
    }
    return $_REQUEST['token'] ?? null;
}

/**
 * Require valid user token
 */
function require_valid_jwt() {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->safeLoad();
    $secretKey = $_ENV['JWT_SECRET'] ?? null;

    if (!$secretKey) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "JWT secret not set"]);
        exit;
    }

    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "No token provided"]);
        exit;
    }

    try {
        return JWT::decode($token, new Key($secretKey, 'HS256'));
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
        exit;
    }
}

/**
 * Require admin (acc_type = 0)
 */
function require_admin() {
    $decoded = require_valid_jwt();
    if (!isset($decoded->acc_type) || (int)$decoded->acc_type !== 0) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Admins only"]);
        exit;
    }
    return $decoded;
}
