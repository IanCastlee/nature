<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once(__DIR__ . '/../vendor/autoload.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

// Use $_ENV for secret
$secretKey = $_ENV['JWT_SECRET'] ?? 'default_secret_key';

/**
 * Create a JWT token
 * 
 * If caller provides an "exp" in $payload (like 1 minute for testing),
 * this function will use that. Otherwise, defaults to 4 hours.
 */
function create_jwt($payload) {
    global $secretKey;
    $issuedAt = time();

    // ✅ Respect provided "exp", otherwise fallback to 4 hours
    $expire = $payload["exp"] ?? ($issuedAt + (60 * 60 * 4));

    $token = JWT::encode(
        array_merge($payload, [
            "iat" => $issuedAt,
            "exp" => $expire
        ]),
        $secretKey,
        'HS256'
    );

    return $token;
}

/**
 * Decode and verify a JWT token
 */
function decode_jwt($token) {
    global $secretKey;
    return JWT::decode($token, new Key($secretKey, 'HS256'));
}
?>
