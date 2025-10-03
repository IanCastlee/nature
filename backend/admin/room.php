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

    if ($roomId) {
        //  Fetch a specific room by ID
        $stmt = $conn->prepare("SELECT r.*,a.*,i.*,rc.category, rc.category_id FROM rooms AS r  JOIN room_categories AS rc ON r.category_id = rc.category_id JOIN amenities AS a ON a.room_id =  r.room_id JOIn inclusions AS i ON i.room_id = r.room_id WHERE r.room_id = ? ");
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

    $uploadDir = "../uploads/rooms/";
    $filename = null;

    // 🖼️ Handle image upload if present
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

    // ================================
    // 1. CREATE NEW ROOM
    // ================================
    if ($action === "create") {
        if (!$room_name || !$category || !$price || !$capacity || !$duration) {
            echo json_encode([
                "success" => false,
                "message" => "❌ All fields are required."
            ]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO rooms (category_id, room_name, price, capacity, duration, image, status) VALUES (?, ?, ?, ?, ?, ?, 'active')");
        $stmt->bind_param("isdiis", $category, $room_name, $price, $capacity, $duration, $filename);

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
            $stmt = $conn->prepare("UPDATE rooms SET  category_id = ?, room_name = ?, price = ?, capacity = ?, duration = ?, image = ? WHERE room_id = ?");
            $stmt->bind_param("isdiisi",  $category, $room_name, $price, $capacity, $duration, $filename, $id);
        } else {
            $stmt = $conn->prepare("UPDATE rooms SET  category_id = ?, room_name = ?, price = ?, capacity = ?, duration = ? WHERE room_id = ?");
            $stmt->bind_param("isdiii", $category, $room_name, $price, $capacity, $duration, $id);
        }

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "✅ Room updated successfully."
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
