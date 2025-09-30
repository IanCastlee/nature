<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    $stmt = $conn->prepare("SELECT * FROM room_categories");
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
}

// Handle POST: Insert new category
if ($method === "POST") {
    $category = $_POST['category'] ?? '';

    if (!$category) {
        echo json_encode([
            "success" => false,
            "message" => "Category is required"
        ]);
        exit;
    }

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = "../uploads/room_categories/";
        $filename = uniqid() . "_" . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;

        // Create directory if not exists
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            // Insert into DB
            $stmt = $conn->prepare("INSERT INTO room_categories (category, image) VALUES (?, ?)");
            $stmt->bind_param("ss", $category, $filename);

            if ($stmt->execute()) {
                echo json_encode([
                    "success" => true,
                    "message" => "Room category added successfully"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Database error: " . $stmt->error
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to upload image"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No image uploaded or upload error"
        ]);
    }

    exit;
}
?>
