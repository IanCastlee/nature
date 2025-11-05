<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if ($method === "GET") {
    $status = $_GET['status'] ?? 'active';

    $stmt = $conn->prepare("SELECT * FROM announcement WHERE status = ?");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["success" => true, "data" => $data]);
    exit;
}

if ($method === "POST") {
    $action = $_POST['action'] ?? 'create';
    $id = $_POST['id'] ?? null;
    $title = $_POST['title'] ?? '';
    $message = $_POST['message'] ?? '';

    if ($action === "create") {
        $stmt = $conn->prepare("INSERT INTO announcement (title, message, createdAt, status) VALUES (?, ?, NOW(), 'active')");
        $stmt->bind_param("ss", $title, $message);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "✅ Announcement added successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "❌ Database error: " . $stmt->error]);
        }
        exit;
    }

    if ($action === "update" && $id) {
        $stmt = $conn->prepare("UPDATE announcement SET title = ?, message = ? WHERE id = ?");
        $stmt->bind_param("ssi", $title, $message, $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "✅ Announcement updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "❌ Database error: " . $stmt->error]);
        }
        exit;
    }

    if ($action === "set_inactive" && $id) {
        $stmt = $conn->prepare("UPDATE announcement SET status = 'inactive' WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Announcement set inactive."]);
        } else {
            echo json_encode(["success" => false, "message" => "❌ Database error: " . $stmt->error]);
        }
        exit;
    }

    echo json_encode(["success" => false, "message" => "❌ Invalid action or missing data."]);
    exit;
}

echo json_encode(["success" => false, "message" => "Unsupported request method."]);
exit;
?>
