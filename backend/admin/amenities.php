<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}



if ($method === "POST") {
    $action = $_POST['action'] ?? 'create';
    $room_id = $_POST['room_id'] ?? null;
    $amenity = $_POST['amenity'] ?? '';
  
    // ================================
    // 1. CREATE NEW ROOM
    // ================================
    if ($action === "create") {
        if (!$room_id || !$amenity) {
            echo json_encode([
                "success" => false,
                "message" => " All fields are required."
            ]);
            exit;
        }

    // =================================
    // Check if room_id already exists
    // =================================
    $checkStmt = $conn->prepare("SELECT amenities FROM amenities WHERE room_id = ?");
    $checkStmt->bind_param("i", $room_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows > 0) {
        //  Room exists — update amenities list
        $row = $result->fetch_assoc();
        $existingAmenities = $row['amenities'];

        // Convert to array (handle CSV or JSON depending on how you're storing)
        $amenitiesArray = array_map('trim', explode(',', $existingAmenities));

        // Avoid duplicates
        if (!in_array($amenity, $amenitiesArray)) {
            $amenitiesArray[] = $amenity;
        }

        // Convert back to CSV string
        $updatedAmenities = implode(', ', $amenitiesArray);

        // Update query
        $updateStmt = $conn->prepare("UPDATE amenities SET amenities = ? WHERE room_id = ?");
        $updateStmt->bind_param("si", $updatedAmenities, $room_id);

        if ($updateStmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => " Amenity updated successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => " Update failed: " . $updateStmt->error
            ]);
        }
    } else {
        // No room — insert new
        $insertStmt = $conn->prepare("INSERT INTO amenities (room_id, amenities) VALUES (?, ?)");
        $insertStmt->bind_param("is", $room_id, $amenity);

        if ($insertStmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "New amenity added successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "❌ Insert failed: " . $insertStmt->error
            ]);
        }
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
