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
    $room_id_get = $_GET['room_id_get'] ?? null;

    if (!$room_id_get) {
        echo json_encode([
            "success" => false,
            "message" => "Missing room_id_get"
        ]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM amenities WHERE room_id = ?");
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


if ($method === 'POST') {
    $action = $_POST['action'] ?? 'create';
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;
    $room_id = isset($_POST['room_id']) ? intval($_POST['room_id']) : null;
    $name = $_POST['name'] ?? '';

    // ================================
    // CREATE AMENITY
    // ================================
    if ($action === "create") {
        if (!$room_id || !$name) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required."
            ]);
            exit;
        }

        // Check if amenity already exists for the room
        $checkStmt = $conn->prepare("SELECT amenities FROM amenities WHERE room_id = ? AND amenities = ?");
        $checkStmt->bind_param("is", $room_id, $name);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows < 1) {
            // Insert new amenity
            $insertStmt = $conn->prepare("INSERT INTO amenities (room_id, amenities) VALUES (?, ?)");
            $insertStmt->bind_param("is", $room_id, $name);

            if ($insertStmt->execute()) {
                echo json_encode([
                    "success" => true,
                    "message" => "New amenity added successfully."
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
                "message" => "Amenity already exists."
            ]);
        }

        exit; // Exit only after create
    }

    // ================================
    // UPDATE AMENITY
    // ================================
    if ($action === "update") {
        if (!$id || !$room_id || !$name) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required for update."
            ]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE amenities SET room_id = ?, amenities = ? WHERE amenity_id = ?");
        $stmt->bind_param("isi", $room_id, $name, $id); 
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Amenity updated successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }

        exit; //  Exit after update
    }


    // ================================
    // DELETE AMENITY
    // ================================
    if ($action === "delete") {
        if (!$id) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required for update."
            ]);
            exit;
        }

      $stmt = $conn->prepare("DELETE FROM amenities WHERE amenity_id = ?");
      $stmt->bind_param("i", $id);
 
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Amenity deleted successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }

        exit; 
    }

    // Optional: Handle invalid actions
    echo json_encode([
        "success" => false,
        "message" => "Invalid action specified."
    ]);
    exit;
}
