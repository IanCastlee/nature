<?php
include("../header.php");
include("../dbConn.php");

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    // Fetch notifications for a specific user
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    if ($user_id === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Missing or invalid user ID"
        ]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT notif_id, from_, to_, message, is_read, created_at 
        FROM notifications 
        WHERE to_ = ? 
        ORDER BY created_at DESC
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }

    echo json_encode([
        "success" => true,
        "notifications" => $notifications,
        "data" => $notifications // ✅ Added alias so your hook can still use "data"
    ]);
    exit;
}

if ($method === "POST") {
    // Accept raw JSON body if sent
    if (isset($_SERVER["CONTENT_TYPE"]) && 
        strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
        $input = json_decode(file_get_contents("php://input"), true);
        $_POST = $input;
    }

    $from = $_POST['from_'] ?? null;
    $to = $_POST['to_'] ?? null;
    $message = $_POST['message'] ?? null;

    if (!$from || !$to || !$message) {
        echo json_encode([
            "success" => false,
            "message" => "Missing fields: from_, to_, or message"
        ]);
        exit;
    }

    $stmt = $conn->prepare("
        INSERT INTO notifications (from_, to_, message, is_read, created_at) 
        VALUES (?, ?, ?, 0, NOW())
    ");
    $stmt->bind_param("iis", $from, $to, $message);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Notification added successfully"
    ]);
    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Invalid request method"
]);
?>
