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

    $stmt = $conn->prepare("SELECT * FROM extras WHERE room_id = ?");
    $stmt->bind_param("i", $room_id_get);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    // Optional: Add default price if it doesn't exist
    foreach ($data as &$extra) {
        if (!isset($extra['price']) || $extra['price'] === null) {
            $extra['price'] = 0; // Default price
        }
    }

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
    $price = $_POST['price'] ?? '';

    // ================================
    // CREATE EXRAS
    // ================================
    if ($action === "create") {
        if (!$room_id || !$name || !$price) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required."
            ]);
            exit;
        }

        // Check if Extras already exists for the room
        $checkStmt = $conn->prepare("SELECT extras FROM extras WHERE room_id = ? AND extras = ?");
        $checkStmt->bind_param("is", $room_id, $name);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows < 1) {
            // Insert new Extras
            $insertStmt = $conn->prepare("INSERT INTO extras (room_id, extras, price) VALUES (?, ?, ?)");
            $insertStmt->bind_param("isd", $room_id, $name, $price);

            if ($insertStmt->execute()) {
                echo json_encode([
                    "success" => true,
                    "message" => "New extras added successfully."
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
                "message" => "Extras already exists."
            ]);
        }

        exit;
    }

    // ================================
    // UPDATE EXTRAS
    // ================================
    if ($action === "update") {
        if (!$id || !$room_id || !$name || !$price) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required for update."
            ]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE extras SET room_id = ?, extras = ?,  price = ? WHERE extra_id = ?");
        $stmt->bind_param("isid", $room_id, $name, $price, $id); 
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Extra updated successfully."
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
    // DELETE EXTRAS
    // ================================
    if ($action === "delete") {
        if (!$id) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required for update."
            ]);
            exit;
        }

      $stmt = $conn->prepare("DELETE FROM extras WHERE extra_id = ?");
      $stmt->bind_param("i", $id);
 
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Extras deleted successfully."
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
