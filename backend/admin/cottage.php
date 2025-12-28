<?php
header('Content-Type: application/json');

// Enable error reporting only for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent (e.g., via Axios or fetch)
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"] ?? '', "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (is_array($input)) {
        $_POST = $input;
    }
}

// ================================
// Handle GET Requests
// ================================
if ($method === "GET") {
    $status = $_GET['status'] ?? null;
    $getId = isset($_GET['id']) ? intval($_GET['id']) : null;

    // 1. Get cottage by ID
    if ($getId) {
        $stmt = $conn->prepare("SELECT * FROM cottages WHERE cottage_id = ?");
        $stmt->bind_param("i", $getId);
        $stmt->execute();
        $result = $stmt->get_result();
        $cottage = $result->fetch_assoc();

        if ($cottage) {
            echo json_encode([
                "success" => true,
                "data" => $cottage
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Cottage not found."
            ]);
        }
        exit;
    }

    // 2. Get all by status (active/inactive)
    if ($status === 'active' || $status === 'inactive') {
        $stmt = $conn->prepare("SELECT * FROM cottages WHERE status = ?");
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

    // 3. Invalid GET input
    echo json_encode([
        "success" => false,
        "message" => "Invalid GET request. Provide 'id' or valid 'status'."
    ]);
    exit;
}

// ================================
// Handle POST Requests
// ================================
if ($method === "POST") {
    $action = $_POST['action'] ?? 'create';

    $id = $_POST['id'] ?? null;
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? '';
    $capacity = $_POST['capacity'] ?? '';
    $duration = $_POST['duration'] ?? '';
    $description = $_POST['description'] ?? '';

    $uploadDir = "../uploads/cottage/";
    $uploadDir_PS = "../uploads/photoSphere/";
    $filename = null;
    $filename_PS = null;

    // Upload: image
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $filename = uniqid() . "_" . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            echo json_encode([
                "success" => false,
                "message" => "❌ Failed to upload image."
            ]);
            exit;
        }
    }

    // Upload: photo sphere
    if (isset($_FILES['photo_sphere']) && $_FILES['photo_sphere']['error'] === UPLOAD_ERR_OK) {
        $filename_PS = uniqid() . "_" . basename($_FILES['photo_sphere']['name']);
        $targetFile = $uploadDir_PS . $filename_PS;

        if (!is_dir($uploadDir_PS)) {
            mkdir($uploadDir_PS, 0755, true);
        }

        if (!move_uploaded_file($_FILES['photo_sphere']['tmp_name'], $targetFile)) {
            echo json_encode([
                "success" => false,
                "message" => "❌ Failed to upload photo_sphere."
            ]);
            exit;
        }
    }

    // 1. CREATE
    if ($action === "create") {
        if (!$name || !$price || !$capacity || !$duration || !$description) {
            echo json_encode([
                "success" => false,
                "message" => "❌ All fields are required."
            ]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO cottages (name, price, capacity, duration, description, image, photosphere) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sdiisss", $name, $price, $capacity, $duration, $description, $filename, $filename_PS);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "✅ Cottage added successfully."
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


// =======================================
// UPDATE COTTAGE (WITH FILE CLEANUP)
// =======================================
if ($action === "update" && $id) {

    //  Get OLD filenames
    $oldStmt = $conn->prepare("SELECT image, photosphere FROM cottages WHERE cottage_id = ?");
    $oldStmt->bind_param("i", $id);
    $oldStmt->execute();
    $oldResult = $oldStmt->get_result();
    $oldData = $oldResult->fetch_assoc();

    $oldImage = $oldData['image'];
    $oldPS    = $oldData['photosphere'];

    //  Prepare UPDATE
    if ($filename && $filename_PS) {
        $stmt = $conn->prepare("
            UPDATE cottages
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?, image = ?, photosphere = ?
            WHERE cottage_id = ?
        ");
        $stmt->bind_param("sdiisssi", $name, $price, $capacity, $duration, $description, $filename, $filename_PS, $id);

    } elseif ($filename) {
        $stmt = $conn->prepare("
            UPDATE cottages
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?, image = ?
            WHERE cottage_id = ?
        ");
        $stmt->bind_param("sdiissi", $name, $price, $capacity, $duration, $description, $filename, $id);

    } elseif ($filename_PS) {
        $stmt = $conn->prepare("
            UPDATE cottages
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?, photosphere = ?
            WHERE cottage_id = ?
        ");
        $stmt->bind_param("sdiissi", $name, $price, $capacity, $duration, $description, $filename_PS, $id);

    } else {
        $stmt = $conn->prepare("
            UPDATE cottages
            SET name = ?, price = ?, capacity = ?, duration = ?, description = ?
            WHERE cottage_id = ?
        ");
        $stmt->bind_param("sdiisi", $name, $price, $capacity, $duration, $description, $id);
    }

    //  Execute UPDATE
    if ($stmt->execute()) {

        //  Delete OLD files ONLY if replaced
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
            "message" => " Cottage updated successfully."
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


    // 3. SET INACTIVE
    if ($action === "set_inactive" && $id) {
        $stmt = $conn->prepare("UPDATE cottages SET status = 'inactive' WHERE cottage_id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Cottage set to inactive."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "❌ Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // 4. SET ACTIVE
    if ($action === "set_active" && $id) {
        $stmt = $conn->prepare("UPDATE cottages SET status = 'active' WHERE cottage_id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Cottage set to active."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "❌ Database error: " . $stmt->error
            ]);
        }
        exit;
    }

    // 5. INVALID ACTION
    echo json_encode([
        "success" => false,
        "message" => "❌ Invalid action or missing required data."
    ]);
    exit;
}

// ================================
// Fallback for Unsupported Method
// ================================
echo json_encode([
    "success" => false,
    "message" => "Unsupported request method."
]);
exit;
