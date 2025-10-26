<?php
header('Content-Type: application/json');
require_once(__DIR__ . '/../dbConn.php'); 
require_once(__DIR__ . '/auth_middleware.php'); 

try {
    $user = require_auth($conn);
    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
