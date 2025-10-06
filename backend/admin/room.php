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
    $roomId = $_GET['id'] ?? null;
    $categoryId = $_GET['categoryId'] ?? null;

    if ($roomId) {
        // Fetch a specific room by ID
        $stmt = $conn->prepare("SELECT r.*, a.amenities, a.amenity_id, e.extras, e.extra_id, i.inclusion, i.inclusion_id, rc.category, rc.category_id 
                                FROM rooms AS r  
                                LEFT JOIN room_categories AS rc ON r.category_id = rc.category_id 
                                LEFT JOIN amenities AS a ON a.room_id = r.room_id 
                                LEFT JOIN inclusions AS i ON i.room_id = r.room_id 
                                LEFT JOIN extras AS e ON e.room_id = r.room_id  
                                WHERE r.room_id = ?");
        $stmt->bind_param("i", $roomId);
        $stmt->execute();
        $result = $stmt->get_result();
        $room = $result->fetch_assoc();

        if ($room) {
            echo json_encode([
                "success" => true,
                "data" => $room
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Room not found."
            ]);
        }
        exit;
    } elseif ($categoryId) {
        // Fetch rooms filtered by category
        $stmt = $conn->prepare("SELECT r.*, a.amenity_id, a.amenities, i.inclusion_id, i.inclusion, e.extra_id, e.extras, rc.category, rc.category_id 
                                FROM rooms AS r  
                                LEFT JOIN room_categories AS rc ON r.category_id = rc.category_id 
                                LEFT JOIN amenities AS a ON a.room_id = r.room_id 
                                LEFT JOIN inclusions AS i ON i.room_id = r.room_id 
                                LEFT JOIN extras AS e ON e.room_id = r.room_id  
                                WHERE r.category_id = ? AND r.status = 'active'");
        $stmt->bind_param("i", $categoryId);
$stmt->execute();
$result = $stmt->get_result();
$room = $result->fetch_all(MYSQLI_ASSOC);

// Always return success, even if no results
echo json_encode([
    "success" => true,
    "data" => $room 
]);
exit;

    } else {
        // Fetch all active rooms
        $stmt = $conn->prepare("SELECT * FROM rooms WHERE status = 'active'");
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $data
        ]);
        exit;
    }
}

if ($method === "POST") {
    $action = $_POST['action'] ?? 'create';
    $id = $_POST['id'] ?? null;

    $room_name = $_POST['room_name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? '';
    $capacity = $_POST['capacity'] ?? '';
    $duration = $_POST['duration'] ?? '';
    $description = $_POST['description'] ?? '';

    $uploadDir = "../uploads/rooms/";
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
        if (!$room_name || !$category || !$price || !$capacity || !$duration) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required."
            ]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO rooms (category_id, room_name, price, capacity, duration, description, image, photo_sphere, status) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')");
        $stmt->bind_param("isdiisss", $category, $room_name, $price, $capacity, $duration, $description, $filename, $filename_PS);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "✅ Room added successfully."
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
    // 2. UPDATE ROOM   
    // ================================
    if ($action === "update" && $id) {
        if ($filename) {
            $stmt = $conn->prepare("UPDATE rooms SET category_id = ?, room_name = ?, price = ?, capacity = ?, duration = ?, description= ?, image = ? photo_sphere = ? WHERE room_id = ?");
            $stmt->bind_param("isdiisssi", $category, $room_name, $price, $capacity, $duration,$description, $filename, $filename_PS, $id);
        } else {
            $stmt = $conn->prepare("UPDATE rooms SET category_id = ?, room_name = ?, price = ?, capacity = ?, duration = ?, description = ? WHERE room_id = ?");
            $stmt->bind_param("isdiisi", $category, $room_name, $price, $capacity, $duration, $description, $id);
        }

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "✅ Room updated successfully."
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
