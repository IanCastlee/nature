<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON body for POST if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"] ?? '', "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (is_array($input)) {
        $_POST = $input;
    }
}

// ================================
// Handle GET requests
// ================================
if ($method === "GET") {
    $status = $_GET['status'] ?? null;
    $getId = isset($_GET['id']) ? intval($_GET['id']) : null;

    // 1. Get a function hall by ID
    if ($getId) {
        $stmt = $conn->prepare("SELECT * FROM function_hall WHERE fh_id = ?");
        $stmt->bind_param("i", $getId);
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
    }

    // 2. Get all active or inactive function halls
    if ($status === 'active' || $status === 'inactive') {
        $stmt = $conn->prepare("SELECT * FROM function_hall WHERE status = ?");
        $stmt->bind_param("s", $status);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $data
        ]);
        exit;
    }

    // 3. Invalid GET request
    echo json_encode([
        "success" => false,
        "message" => "Invalid GET request. Provide 'id' or valid 'status'."
    ]);
    exit;
}

// ================================
// Handle POST requests
// ================================
if ($method === "POST") {
    $action = $_POST['action'] ?? '';
    $id = $_POST['id'] ?? null;
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $capacity = $_POST['capacity'] ?? '';
    $duration = $_POST['duration'] ?? '';
    $description = $_POST['description'] ?? '';

    $uploadDir = "../uploads/function_hall/";
    $uploadDir_PS = "../uploads/photosphere/";
    $filename = null;
    $filename_PS = null;

    // Handle image upload
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

    // Handle photo sphere upload
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

    // 1. CREATE new room
    if ($action === "create") {
        if (!$name || !$price || !$capacity || !$duration || !$description) {
            echo json_encode([
                "success" => false,
                "message" => "All fields are required."
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




//////////////////////////////////////////////////////////////////////////////////////


    // 2. UPDATE room
   // ================================
// UPDATE FUNCTION HALL (WITH FILE CLEANUP)
// ================================
if ($action === "update" && $id) {

    //  Get old filenames first
    $oldStmt = $conn->prepare("SELECT image, photosphere FROM function_hall WHERE fh_id = ?");
    $oldStmt->bind_param("i", $id);
    $oldStmt->execute();
    $oldResult = $oldStmt->get_result();
    $oldData = $oldResult->fetch_assoc();

    $oldImage = $oldData['image'];          // function_hall image
    $oldPS    = $oldData['photosphere'];    // photosphere image

    //  Prepare UPDATE statement
    if ($filename && $filename_PS) {
        $stmt = $conn->prepare("
            UPDATE function_hall
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?, image = ?, photosphere = ?
            WHERE fh_id = ?
        ");
        $stmt->bind_param("sdiisssi", $name, $price, $capacity, $duration, $description, $filename, $filename_PS, $id);

    } elseif ($filename) {
        $stmt = $conn->prepare("
            UPDATE function_hall
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?, image = ?
            WHERE fh_id = ?
        ");
        $stmt->bind_param("sdiissi", $name, $price, $capacity, $duration, $description, $filename, $id);

    } elseif ($filename_PS) {
        $stmt = $conn->prepare("
            UPDATE function_hall
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?, photosphere = ?
            WHERE fh_id = ?
        ");
        $stmt->bind_param("sdiissi", $name, $price, $capacity, $duration, $description, $filename_PS, $id);

    } else {
        $stmt = $conn->prepare("
            UPDATE function_hall
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?
            WHERE fh_id = ?
        ");
        $stmt->bind_param("sdiisi", $name, $price, $capacity, $duration, $description, $id);
    }

    //  Execute UPDATE
    if ($stmt->execute()) {

        //  Delete OLD files only if replaced
        if ($filename && $oldImage && $oldImage !== $filename) {
            $oldImagePath = $uploadDir . $oldImage;
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        if ($filename_PS && $oldPS && $oldPS !== $filename_PS) {
            $oldPSPath = $uploadDir_PS . $oldPS;
            if (file_exists($oldPSPath)) {
                unlink($oldPSPath);
            }
        }

        echo json_encode([
            "success" => true,
            "message" => "Function Hall updated successfully."
        ]);

    } else {
        echo json_encode([
            "success" => false,
            "message" => "❌ Database error: " . $stmt->error
        ]);
    }

    exit;
}

//////////////////////////////////////////////////////////////////////////////////////


    // 3. SET to inactive
    if ($action === "set_inactive" && $id) {
        $stmt = $conn->prepare("UPDATE function_hall SET status = 'inactive' WHERE fh_id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Function Hall set to inactive."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // 4. SET to active
    if ($action === "set_active" && $id) {
        $stmt = $conn->prepare("UPDATE function_hall SET status = 'active' WHERE fh_id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Function Hall set to active."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // 5. Invalid POST action
    echo json_encode([
        "success" => false,
        "message" => "❌ Invalid action or missing required data."
    ]);
    exit;
}

// ================================
// Unsupported HTTP Method
// ================================
echo json_encode([
    "success" => false,
    "message" => "Unsupported request method."
]);
exit;
