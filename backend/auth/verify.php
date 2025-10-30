<?php
include("../dbConn.php");
include("../header.php");

// Remove JSON header since we're doing redirects
// header("Content-Type: application/json");

if (!isset($_GET['token'])) {
    header("Location: http://localhost:5173/verified?status=fail&msg=" . urlencode("Verification token is required."));
    exit;
}

$token = $_GET['token'];

$stmt = $conn->prepare("
    SELECT user_id, email_verified, verification_expires_at 
    FROM users 
    WHERE verification_token = ? 
    LIMIT 1
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Check expiration
    if (strtotime($row['verification_expires_at']) < time()) {
        header("Location: http://localhost:5173/verified?status=fail&msg=" . urlencode("Verification link has expired. Please request a new one."));
        exit;
    }

    if ($row['email_verified'] == 0) {
        $update = $conn->prepare("
            UPDATE users 
            SET email_verified = 1, updated_at = NOW() 
            WHERE verification_token = ?
        ");
        $update->bind_param("s", $token);
        $update->execute();
    }

    // Redirect to frontend after success with message
    header("Location: http://localhost:5173/verified?status=success&msg=" . urlencode("Email verified successfully!"));
    exit;

} else {
    header("Location: http://localhost:5173/verified?status=fail&msg=" . urlencode("Invalid or expired verification token."));
    exit;
}

$conn->close();
?>
