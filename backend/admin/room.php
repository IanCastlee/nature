<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

/*  🔧 AUTO-MAINTENANCE CHECK */
$conn->query("
    UPDATE rooms
    SET status = 'under_maintenance',
        last_maintenance = CURDATE()
    WHERE DATEDIFF(CURDATE(), last_maintenance) >= 80
      AND status != 'under_maintenance'
");

/* ======================================================
   🔹 GET REQUESTS
====================================================== */
if ($method === "GET") {
    $roomId = $_GET['id'] ?? null;
    $categoryId = $_GET['categoryId'] ?? null;
    $status = $_GET['status'] ?? 'active';

    // ✅ 1. Fetch single room by ID (with images, amenities, inclusions, extras)
    if ($roomId) {
        $stmt = $conn->prepare("SELECT r.*, 
                                       a.amenities, a.amenity_id, 
                                       e.extras, e.extra_id, 
                                       i.inclusion, i.inclusion_id, 
                                       rc.category, rc.category_id 
                                FROM rooms AS r  
                                LEFT JOIN room_categories AS rc ON r.category_id = rc.category_id 
                                LEFT JOIN amenities AS a ON a.room_id = r.room_id 
                                LEFT JOIN inclusions AS i ON i.room_id = r.room_id 
                                LEFT JOIN extras AS e ON e.room_id = r.room_id  
                                WHERE r.room_id = ?");
        $stmt->bind_param("i", $roomId);
        $stmt->execute();
        $result = $stmt->get_result();

        $roomData = [];
        $amenities = [];
        $inclusions = [];
        $extras = [];

        while ($row = $result->fetch_assoc()) {
            if (empty($roomData)) {
                $roomData = [
                    "room_id" => $row["room_id"],
                    "room_name" => $row["room_name"],
                    "price" => $row["price"],
                    "capacity" => $row["capacity"],
                    "duration" => $row["duration"],
                    "description" => $row["description"],
                    "category" => $row["category"],
                    "category_id" => $row["category_id"],
                    "photo_sphere" => $row["photo_sphere"],
                    "withExtras" => $row["withExtras"],
                ];
            }

            if (!empty($row["amenities"])) $amenities[] = $row["amenities"];
            if (!empty($row["inclusion"])) $inclusions[] = $row["inclusion"];
            if (!empty($row["extras"])) $extras[] = $row["extras"];
        }

        if (!empty($roomData)) {
            // ✅ Fetch room images
            $imgStmt = $conn->prepare("SELECT image_path FROM room_images WHERE room_id=?");
            $imgStmt->bind_param("i", $roomData['room_id']);
            $imgStmt->execute();
            $imgRes = $imgStmt->get_result();

            $images = [];
            while ($img = $imgRes->fetch_assoc()) {
                $images[] = $img['image_path'];
            }

            $roomData["images"] = $images;
            $roomData["amenities"] = implode(",", array_unique($amenities));
            $roomData["inclusion"] = implode(",", array_unique($inclusions));
            $roomData["extras"] = implode(",", array_unique($extras));

            echo json_encode(["success" => true, "data" => $roomData]);
        } else {
            echo json_encode(["success" => false, "message" => "Room not found."]);
        }
        exit;
    }

    // ✅ 2. Fetch rooms by category
    elseif ($categoryId) {
        $stmt = $conn->prepare("SELECT r.*, rc.category_id, rc.category 
                                FROM rooms AS r 
                                JOIN room_categories AS rc ON r.category_id = rc.category_id 
                                WHERE r.category_id = ? AND r.status != 'inactive'");
        $stmt->bind_param("i", $categoryId);
        $stmt->execute();
        $result = $stmt->get_result();

        $rooms = [];
        while ($row = $result->fetch_assoc()) {
            // fetch images
            $imgStmt = $conn->prepare("SELECT image_path FROM room_images WHERE room_id=?");
            $imgStmt->bind_param("i", $row['room_id']);
            $imgStmt->execute();
            $imgRes = $imgStmt->get_result();

            $images = [];
            while ($img = $imgRes->fetch_assoc()) {
                $images[] = $img['image_path'];
            }

            $row['images'] = $images;
            $rooms[] = $row;
        }

        echo json_encode(["success" => true, "data" => $rooms]);
        exit;
    }

    // ✅ 3. Fetch all rooms by status
    else {
        $stmt = $conn->prepare("SELECT * FROM rooms WHERE status=?");
        $stmt->bind_param("s", $status);
        $stmt->execute();
        $result = $stmt->get_result();

        $rooms = [];
        while ($row = $result->fetch_assoc()) {
            // fetch images
            $imgStmt = $conn->prepare("SELECT image_path FROM room_images WHERE room_id=?");
            $imgStmt->bind_param("i", $row['room_id']);
            $imgStmt->execute();
            $imgRes = $imgStmt->get_result();

            $images = [];
            while ($img = $imgRes->fetch_assoc()) {
                $images[] = $img['image_path'];
            }

            $row['images'] = $images;
            $rooms[] = $row;
        }

        echo json_encode(["success" => true, "data" => $rooms]);
        exit;
    }
}

/* ======================================================
   🔹 POST REQUESTS
====================================================== */
if ($method === "POST") {
    $action = $_POST['action'] ?? 'create';
    $id = $_POST['id'] ?? null;

    $room_name = $_POST['room_name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? '';
    $capacity = $_POST['capacity'] ?? '';
    $duration = $_POST['duration'] ?? '';
    $description = $_POST['description'] ?? '';

    $uploadDir = "../uploads/photoSphere/";
    $filename_PS = null;

    // Handle photo sphere upload
    if (isset($_FILES['photo_sphere']) && $_FILES['photo_sphere']['error'] === UPLOAD_ERR_OK) {
        $filename_PS = uniqid() . "_" . basename($_FILES['photo_sphere']['name']);
        $targetFile = $uploadDir . $filename_PS;

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        if (!move_uploaded_file($_FILES['photo_sphere']['tmp_name'], $targetFile)) {
            echo json_encode(["success" => false, "message" => "❌ Failed to upload photo sphere."]);
            exit;
        }
    }

    // ✅ CREATE ROOM
    if ($action === "create") {
        if (!$room_name || !$category || !$price || !$capacity || !$duration) {
            echo json_encode(["success" => false, "message" => "All fields are required."]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO rooms (category_id, room_name, price, capacity, duration, description, photo_sphere, status, last_maintenance)
                                VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURDATE())");
        $stmt->bind_param("isdiiss", $category, $room_name, $price, $capacity, $duration, $description, $filename_PS);

        if ($stmt->execute()) {
            $newRoomId = $stmt->insert_id;

            // Handle multiple image uploads
            if (!empty($_FILES['images']['name'][0])) {
                $uploadDir = "../uploads/rooms/";
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    $fileName = uniqid() . "_" . basename($_FILES['images']['name'][$key]);
                    $targetFile = $uploadDir . $fileName;
                    if (move_uploaded_file($tmpName, $targetFile)) {
                        $conn->query("INSERT INTO room_images (room_id, image_path) VALUES ($newRoomId, '$fileName')");
                    }
                }
            }

            echo json_encode(["success" => true, "message" => "✅ Room added successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "❌ Database error: " . $stmt->error]);
        }
        exit;
    }

    // ✅ UPDATE ROOM
    if ($action === "update" && $id) {
        if ($filename_PS) {
            $stmt = $conn->prepare("UPDATE rooms SET category_id=?, room_name=?, price=?, capacity=?, duration=?, description=?, photo_sphere=? WHERE room_id=?");
            $stmt->bind_param("isdiissi", $category, $room_name, $price, $capacity, $duration, $description, $filename_PS, $id);
        } else {
            $stmt = $conn->prepare("UPDATE rooms SET category_id=?, room_name=?, price=?, capacity=?, duration=?, description=? WHERE room_id=?");
            $stmt->bind_param("isdiisi", $category, $room_name, $price, $capacity, $duration, $description, $id);
        }

        if ($stmt->execute()) {
            // Optional: handle new image uploads
            if (!empty($_FILES['images']['name'][0])) {
                $uploadDir = "../uploads/rooms/";
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    $fileName = uniqid() . "_" . basename($_FILES['images']['name'][$key]);
                    $targetFile = $uploadDir . $fileName;
                    if (move_uploaded_file($tmpName, $targetFile)) {
                        $conn->query("INSERT INTO room_images (room_id, image_path) VALUES ($id, '$fileName')");
                    }
                }
            }

            echo json_encode(["success" => true, "message" => "✅ Room updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "❌ Database error: " . $stmt->error]);
        }
        exit;
    }

    // ✅ SET INACTIVE / ACTIVE
    if ($action === "set_inactive" && $id) {
        $stmt = $conn->prepare("UPDATE rooms SET status='inactive' WHERE room_id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "✅ Room set to inactive."]);
        exit;
    }

    if ($action === "set_active" && $id) {
        $stmt = $conn->prepare("UPDATE rooms SET status='active' WHERE room_id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "✅ Room set to active."]);
        exit;
    }

    echo json_encode(["success" => false, "message" => "❌ Invalid action or missing data."]);
    exit;
}
?>
