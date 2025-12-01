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
    // Fetch all terms and conditions
    $stmt = $conn->prepare("SELECT * FROM term_conditions ORDER BY last_update DESC");
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
    $content = $_POST['content'] ?? '';

    if ($action === "create") {
        $stmt = $conn->prepare("INSERT INTO term_conditions (title, content, last_update) VALUES (?, ?, NOW())");
        $stmt->bind_param("ss", $title, $content);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "✅ Terms & Conditions added successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "❌ Database error: " . $stmt->error]);
        }
        exit;
    }

    if ($action === "update" && $id) {
        $stmt = $conn->prepare("UPDATE term_conditions SET title = ?, content = ?, last_update = NOW() WHERE id = ?");
        $stmt->bind_param("ssi", $title, $content, $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "✅ Terms & Conditions updated successfully."]);
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
