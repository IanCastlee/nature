<?php
include("../header.php");
include("../dbConn.php");

// 🔒 Prevent warnings from breaking JSON
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);

/* ======================================================
   JSON & DATA SAFETY HELPERS
====================================================== */

// Safe JSON encoding
function safe_json($data) {
    return json_encode($data, JSON_INVALID_UTF8_SUBSTITUTE | JSON_UNESCAPED_UNICODE);
}

// Replace NULL with ""
function clean_row($row) {
    return array_map(function($v) {
        return $v === null ? "" : $v;
    }, $row);
}

$method = $_SERVER['REQUEST_METHOD'];

/* Handle raw JSON from Axios */
if ($method === "POST" && isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

/* ======================================================
   AUTO-MAINTENANCE CHECK
====================================================== */
$conn->query("
    UPDATE rooms
    SET status = 'under_maintenance', last_maintenance = CURDATE()
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

    /* 🔥 1. SINGLE ROOM */
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
            $row = clean_row($row);

            if (empty($roomData)) {
                $roomData = $row;
            }

            if (!empty($row["amenities"])) $amenities[] = $row["amenities"];
            if (!empty($row["inclusion"])) $inclusions[] = $row["inclusion"];
            if (!empty($row["extras"])) $extras[] = $row["extras"];
        }

        if (!empty($roomData)) {

            // Room images
            $imgStmt = $conn->prepare("SELECT image_path FROM room_images WHERE room_id=?");
            $imgStmt->bind_param("i", $roomData['room_id']);
            $imgStmt->execute();
            $imgRes = $imgStmt->get_result();

            $images = [];
            while ($img = $imgRes->fetch_assoc()) {
                $images[] = $img['image_path'] ?? "";
            }

            $roomData["images"] = $images;
            $roomData["amenities"] = implode(",", array_unique($amenities));
            $roomData["inclusion"] = implode(",", array_unique($inclusions));
            $roomData["extras"] = implode(",", array_unique($extras));

            echo safe_json(["success" => true, "data" => $roomData]);
        } else {
            echo safe_json(["success" => false, "message" => "Room not found"]);
        }
        exit;
    }

    /* 🔥 2. ROOMS BY CATEGORY */
    if ($categoryId) {

        if (!is_numeric($categoryId)) {
            echo safe_json(["success" => false, "message" => "Invalid category"]);
            exit;
        }

        $stmt = $conn->prepare("SELECT r.*, rc.category_id, rc.category 
                                FROM rooms AS r 
                                JOIN room_categories AS rc ON r.category_id = rc.category_id 
                                WHERE r.category_id = ? AND r.status != 'inactive'");
        $stmt->bind_param("i", $categoryId);
        $stmt->execute();
        $result = $stmt->get_result();

        $rooms = [];

        while ($row = $result->fetch_assoc()) {
            $row = clean_row($row);

            // Images
            $imgStmt = $conn->prepare("SELECT image_path FROM room_images WHERE room_id=?");
            $imgStmt->bind_param("i", $row['room_id']);
            $imgStmt->execute();
            $imgRes = $imgStmt->get_result();

            $images = [];
            while ($img = $imgRes->fetch_assoc()) {
                $images[] = $img['image_path'] ?? "";
            }

            // Extras
            $extraStmt = $conn->prepare("SELECT extra_id, extras, price FROM extras WHERE room_id=?");
            $extraStmt->bind_param("i", $row['room_id']);
            $extraStmt->execute();
            $extraRes = $extraStmt->get_result();

            $extras = [];
            while ($ex = $extraRes->fetch_assoc()) {
                $extras[] = clean_row($ex);
            }

            $row['images'] = $images;
            $row['extras'] = $extras;

            $rooms[] = $row;
        }

        echo safe_json(["success" => true, "data" => $rooms]);
        exit;
    }

    /* 🔥 3. ALL ROOMS BY STATUS */
    $stmt = $conn->prepare("SELECT * FROM rooms WHERE status=?");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();

    $rooms = [];

    while ($row = $result->fetch_assoc()) {
        $row = clean_row($row);

        $imgStmt = $conn->prepare("SELECT image_path FROM room_images WHERE room_id=?");
        $imgStmt->bind_param("i", $row['room_id']);
        $imgStmt->execute();
        $imgRes = $imgStmt->get_result();

        $images = [];
        while ($img = $imgRes->fetch_assoc()) {
            $images[] = $img['image_path'] ?? "";
        }

        $row['images'] = $images;
        $rooms[] = $row;
    }

    echo safe_json(["success" => true, "data" => $rooms]);
    exit;
}

/* ======================================================
   🔹 POST REQUESTS (FULL WORKING VERSION)
====================================================== */
if ($method === "POST") {

    $action = $_POST['action'] ?? "";
    $id = $_POST['id'] ?? null;

    /* ========== SET INACTIVE ========== */
    if ($action === "set_inactive" && $id) {
        $stmt = $conn->prepare("UPDATE rooms SET status='inactive' WHERE room_id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo safe_json(["success" => true, "message" => "Room set to inactive"]);
        exit;
    }

    /* ========== SET ACTIVE ========== */
    if ($action === "set_active" && $id) {
        $stmt = $conn->prepare("UPDATE rooms SET status='active' WHERE room_id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo safe_json(["success" => true, "message" => "Room set to active"]);
        exit;
    }

    /* ================= CREATE / UPDATE shared fields ================= */
    $room_name = $_POST['room_name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? '';
    $capacity = $_POST['capacity'] ?? '';
    $duration = $_POST['duration'] ?? '';
    $time_in_out = $_POST['time_in_out'] ?? '';
    $description = $_POST['description'] ?? '';

    // PhotoSphere
    $uploadDir = "../uploads/photoSphere/";
    $filename_PS = null;

    if (isset($_FILES['photo_sphere']) && $_FILES['photo_sphere']['error'] === UPLOAD_ERR_OK) {
        $filename_PS = uniqid() . "_" . basename($_FILES['photo_sphere']['name']);
        $targetFile = $uploadDir . $filename_PS;

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        move_uploaded_file($_FILES['photo_sphere']['tmp_name'], $targetFile);
    }

    /* ========== CREATE ROOM ========== */
    if ($action === "create") {

        $stmt = $conn->prepare("INSERT INTO rooms 
            (category_id, room_name, price, capacity, duration, time_in_out, description, photo_sphere, status, last_maintenance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', CURDATE())");
        $stmt->bind_param("isdiisss", $category, $room_name, $price, $capacity, $duration, $time_in_out, $description, $filename_PS);

        if ($stmt->execute()) {
            $newRoomId = $stmt->insert_id;

            // Upload images
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

            echo safe_json(["success" => true, "message" => "Room added successfully"]);
        } else {
            echo safe_json(["success" => false, "message" => "DB Error: " . $stmt->error]);
        }
        exit;
    }

    /* ========== UPDATE ROOM ========== */
    if ($action === "update" && $id) {

        if ($filename_PS) {
            $stmt = $conn->prepare("UPDATE rooms 
                SET category_id=?, room_name=?, price=?, capacity=?, duration=?, time_in_out=?, description=?, photo_sphere=? 
                WHERE room_id=?");
            $stmt->bind_param("isdiisssi", $category, $room_name, $price, $capacity, $duration, $time_in_out, $description, $filename_PS, $id);
        } else {
            $stmt = $conn->prepare("UPDATE rooms 
                SET category_id=?, room_name=?, price=?, capacity=?, duration=?, time_in_out=?,  description=? 
                WHERE room_id=?");
            $stmt->bind_param("isdiissi", $category, $room_name, $price, $capacity, $duration,$time_in_out, $description, $id);
        }

        if ($stmt->execute()) {

            // ADD new room images
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

            echo safe_json(["success" => true, "message" => "Room updated successfully"]);
        } else {
            echo safe_json(["success" => false, "message" => "DB Error: " . $stmt->error]);
        }
        exit;
    }

    echo safe_json(["success" => false, "message" => "Invalid action"]);
    exit;
}

?>
