<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// ✅ Accept raw JSON body if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if ($method === "GET") {
    // ✅ Get only active categories
    $stmt = $conn->prepare("SELECT * FROM room_categories WHERE status = 'active'");
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
}

if ($method === "POST") {
    $category = $_POST['category'] ?? '';
    $action = $_POST['action'] ?? 'create';
    $id = $_POST['id'] ?? null;

    $uploadDir = "../uploads/room_categories/";
    $filename = null;

    // ✅ Handle file upload if form-data and image provided
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $filename = uniqid() . "_" . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to upload image"
            ]);
            exit;
        }
    }

    // =======================================
    // 1. CREATE NEW ROOM CATEGORY
    // =======================================
    if ($action === "create") {
        if (!$category || !$filename) {
            echo json_encode([
                "success" => false,
                "message" => "Category and image are required"
            ]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO room_categories (category, image, status) VALUES (?, ?, 'active')");
        $stmt->bind_param("ss", $category, $filename);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Room category added successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // =======================================
    // 2. UPDATE EXISTING ROOM CATEGORY
    // =======================================
    if ($action === "update" && $id) {
        if ($filename) {
            $stmt = $conn->prepare("UPDATE room_categories SET category = ?, image = ? WHERE category_id = ?");
            $stmt->bind_param("ssi", $category, $filename, $id);
        } else {
            $stmt = $conn->prepare("UPDATE room_categories SET category = ? WHERE category_id = ?");
            $stmt->bind_param("si", $category, $id);
        }

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Room category updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // =======================================
    // 3. SET ROOM CATEGORY AS INACTIVE
    // =======================================
    if ($action === 'set_inactive' && $id) {
        $query = "UPDATE room_categories SET status = 'inactive' WHERE category_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Room category set to inactive"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // =======================================
    // 4. INVALID REQUEST FALLBACK
    // =======================================
    echo json_encode([
        "success" => false,
        "message" => "Invalid action or missing required data"
    ]);
    exit;
}
