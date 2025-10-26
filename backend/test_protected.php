<?php
require_once "./auth/auth_middleware.php";

$user = require_auth($conn);
echo json_encode(["success" => true, "message" => "You are authenticated", "user" => $user]);
?>
