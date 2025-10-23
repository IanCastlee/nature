<?php
include("../header.php");
require_once "../dbConn.php";
require_once "../config/jwt.php";

header("Content-Type: application/json");

$refreshToken = $_POST["refresh_token"] ?? "";

if (empty($refreshToken)) {
    echo json_encode(["success" => false, "message" => "No refresh token provided"]);
    exit;
}

try {
    // Find refresh token in DB and check if valid
    $stmt = $conn->prepare("
        SELECT rt.*, u.user_id, u.email, u.acc_type, u.firstname, u.lastname
        FROM refresh_tokens rt
        JOIN users u ON rt.user_id = u.user_id
        WHERE rt.token = ? AND rt.revoked = 0 AND rt.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->bind_param("s", $refreshToken);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Invalid or expired refresh token"]);
        exit;
    }

    $data = $result->fetch_assoc();

    // Create new access token
    $payload = [
        "user_id" => $data["user_id"],
        "email" => $data["email"],
        "acc_type" => $data["acc_type"],
        "exp" => time() + (60 * 15)
    ];
    $newAccessToken = create_jwt($payload);

    echo json_encode([
        "success" => true,
        "access_token" => $newAccessToken,
        "user" => [
            "user_id" => $data["user_id"],
            "firstname" => $data["firstname"],
            "lastname" => $data["lastname"],
            "email" => $data["email"],
            "acc_type" => $data["acc_type"]
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
