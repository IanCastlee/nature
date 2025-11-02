<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

// ===========================
// GET ROOM IMAGES
// ===========================
if ($method === "GET") {
    $room_id_get = $_GET['room_id_get'] ?? null;

    if (!$room_id_get) {
        echo json_encode([
            "success" => false,
            "message" => "Missing room_id_get"
        ]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM room_images WHERE room_id = ?");
    $stmt->bind_param("i", $room_id_get);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
}

// ===========================
// POST REQUESTS
// ===========================
if ($method === 'POST') {
    $action = $_POST['action'] ?? 'create';
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;
    $room_id = isset($_POST['room_id']) ? intval($_POST['room_id']) : null;
    $image_path = $_POST['image_path'] ?? '';

    // ================================
    // CREATE ROOM IMAGE
    // ================================
    if ($action === "create") {
        if (!$room_id || !$image_path) {
            echo json_encode([
                "success" => false,
                "message" => "room_id and image_path are required."
            ]);
            exit;
        }

        // Check if image already exists for this room
        $checkStmt = $conn->prepare("SELECT id FROM room_images WHERE room_id = ? AND image_path = ?");
        $checkStmt->bind_param("is", $room_id, $image_path);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows < 1) {
            // Insert new room image
            $insertStmt = $conn->prepare("INSERT INTO room_images (room_id, image_path) VALUES (?, ?)");
            $insertStmt->bind_param("is", $room_id, $image_path);

            if ($insertStmt->execute()) {
                echo json_encode([
                    "success" => true,
                    "message" => "New image added successfully."
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Insert failed: " . $insertStmt->error
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "This image already exists for this room."
            ]);
        }

        exit;
    }

    // ================================
    // UPDATE ROOM IMAGE
    // ================================
    if ($action === "update") {
        if (!$id || !$room_id || !$image_path) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required for update."
            ]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE room_images SET room_id = ?, image_path = ? WHERE id = ?");
        $stmt->bind_param("isi", $room_id, $image_path, $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Room image updated successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }

        exit;
    }

    // ================================
    // DELETE ROOM IMAGE
    // ================================
    if ($action === "delete") {
        if (!$id) {
            echo json_encode([
                "success" => false,
                "message" => "Missing image id for deletion."
            ]);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM room_images WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Room image deleted successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }

        exit;
    }

    // ================================
    // INVALID ACTION
    // ================================
    echo json_encode([
        "success" => false,
        "message" => "Invalid action specified."
    ]);
    exit;
}
?>
