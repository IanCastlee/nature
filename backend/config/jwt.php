<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once(__DIR__ . '/../vendor/autoload.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

// Use $_ENV for secret
$secretKey = $_ENV['JWT_SECRET'] ?? 'default_secret_key';

function create_jwt($payload) {
    global $secretKey;
    $issuedAt = time();
    $expire = $issuedAt + (60 * 60 * 4); // 4 hours

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

function decode_jwt($token) {
    global $secretKey;
    return JWT::decode($token, new Key($secretKey, 'HS256'));
}
?>
