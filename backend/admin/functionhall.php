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
        // Fetch a function  hall 
    $stmt = $conn->prepare("SELECT * FROM function_hall WHERE status = 'active'");
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
    $action = $_POST['action'] ?? 'create';
  
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $capacity = $_POST['capacity'] ?? '';
    $duration = $_POST['duration'] ?? '';
    $description = $_POST['description'] ?? '';

    $uploadDir = "../uploads/function_hall/";
    $uploadDir_PS = "../uploads/photoSphere/";
    $filename = null;
    $filename_PS = null;

    // Handle image upload if present
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $filename = uniqid() . "_" . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            echo json_encode([
                "success" => false,
                "message" => "❌ Failed to upload image. Check directory permissions."
            ]);
            exit;
        }
    }

        // Handle photo  sphere upload if present
    if (isset($_FILES['photo_sphere']) && $_FILES['photo_sphere']['error'] === UPLOAD_ERR_OK) {
        $filename_PS = uniqid() . "_" . basename($_FILES['photo_sphere']['name']);
        $targetFile = $uploadDir_PS . $filename_PS;

        if (!is_dir($uploadDir_PS)) {
            mkdir($uploadDir_PS, 0755, true);
        }

        if (!move_uploaded_file($_FILES['photo_sphere']['tmp_name'], $targetFile)) {
            echo json_encode([
                "success" => false,
                "message" => "❌ Failed to upload photo_sphere. Check directory permissions."
            ]);
            exit;
        }
    }


    // ================================
    // 1. CREATE NEW ROOM
    // ================================
    if ($action === "create") {
        if (!$name  || !$price || !$capacity || !$duration || !$description) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are requxxxxired."
            ]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO function_hall (name, price, capacity, duration, description, image, photosphere) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sdiisss", $name, $price, $capacity, $duration, $description, $filename, $filename_PS);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Function Hall added successfully."
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
    // 2. UPDATE ROOM   
    // ================================
    if ($action === "update" && $id) {
        if ($filename) {
            $stmt = $conn->prepare("UPDATE function_hall SET name = ?, price = ?, capacity = ?, duration = ?, description= ?, image = ?, photosphere = ? WHERE fh_id = ?");
            $stmt->bind_param("sdiisssi", $name, $price, $capacity, $duration,$description, $filename, $filename_PS, $id);
        } else {
             $stmt = $conn->prepare("UPDATE function_hall SET name = ?, price = ?, capacity = ?, duration = ?, description= ? WHERE fh_id = ?");
            $stmt->bind_param("sdiisi", $name, $price, $capacity, $duration,$description, $id);
        }

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "✅ Function Hall updated successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "❌ Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // ================================
    // 3. SET ROOM INACTIVE
    // ================================
    if ($action === "set_inactive" && $id) {
        $stmt = $conn->prepare("UPDATE rooms SET status = 'inactive' WHERE room_id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "✅ Room set to inactive."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "❌ Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // ================================
    // 4. INVALID ACTION
    // ================================
    echo json_encode([
        "success" => false,
        "message" => "❌ Invalid action or missing required data."
    ]);
    exit;
}
