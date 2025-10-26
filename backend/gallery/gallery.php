<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Allow JSON body (Axios sends JSON by default)
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (is_array($input)) {
        $_POST = array_merge($_POST, $input);
    }
}

// -------------------------
// HANDLE POST UPLOAD
// -------------------------
if ($method === "POST" && isset($_FILES) && !empty($_FILES)) {
    $userId = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;

    if ($userId <= 0) {
        echo json_encode(["success" => false, "message" => "Invalid user ID."]);
        exit;
    }

    // Check existing uploaded images for this user
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM gallery WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $existingCount = intval($row['count']);
    $stmt->close();

    $maxLimit = 5;
    $fileCount = count($_FILES);

    if ($existingCount >= $maxLimit) {
        echo json_encode([
            "success" => false,
            "message" => "You have reached the maximum upload limit of {$maxLimit} images."
        ]);
        exit;
    }

    if ($existingCount + $fileCount > $maxLimit) {
        echo json_encode([
            "success" => false,
            "message" => "You can upload only " . ($maxLimit - $existingCount) . " more images."
        ]);
        exit;
    }

    if ($fileCount < 1) {
        echo json_encode(["success" => false, "message" => "Please upload at least 1 image."]);
        exit;
    }

    $uploadDir = "../uploads/gallery/";
    $uploadedFiles = [];

    foreach ($_FILES as $file) {
        if ($file['error'] === UPLOAD_ERR_OK) {
            $tmpName = $file['tmp_name'];
            $filename = basename($file['name']);
            $uniqueFilename = time() . "_" . uniqid() . "_" . $filename;
            $targetPath = $uploadDir . $uniqueFilename;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $datePosted = date("Y-m-d H:i:s");

                $stmt = $conn->prepare("INSERT INTO gallery (user_id, image, date_posted, status) VALUES (?, ?, ?, 'pending')");
                $stmt->bind_param("iss", $userId, $uniqueFilename, $datePosted);
                $stmt->execute();
                $stmt->close();

                $uploadedFiles[] = $uniqueFilename;
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to move uploaded file: " . $filename
                ]);
                exit;
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Upload error for file: " . $file['name']
            ]);
            exit;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Images uploaded successfully.",
        "data" => $uploadedFiles
    ]);
    exit;
}

// -------------------------
// HANDLE ACTION REQUESTS (approve / reject / set inactive)
// -------------------------
if ($method === "POST" && isset($_POST['action'])) {
    $action = $_POST['action'];
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "Invalid ID."]);
        exit;
    }

    if ($action === "set_approve") {
        $stmt = $conn->prepare("UPDATE gallery SET status = 'posted' WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Post approved successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes made or post not found."]);
        }
        $stmt->close();
        exit;
    }

    if ($action === "set_reject") {
        $stmt = $conn->prepare("UPDATE gallery SET status = 'rejected' WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Post rejected successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes made or post not found."]);
        }
        $stmt->close();
        exit;
    }

    if ($action === "set_inactive") {
        $stmt = $conn->prepare("UPDATE gallery SET status = 'inactive' WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Post set to inactive."]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes made or post not found."]);
        }
        $stmt->close();
        exit;
    }

    echo json_encode(["success" => false, "message" => "Unknown action."]);
    exit;
}

// -------------------------
// HANDLE GET IMAGES (posted / pending)
// -------------------------
if ($method === "GET") {
    $status = isset($_GET['status']) ? $_GET['status'] : '';

    if (in_array($status, ['posted', 'pending'])) {
        $stmt = $conn->prepare("
            SELECT g.*, u.firstname, u.lastname 
            FROM gallery AS g 
            JOIN users AS u ON g.user_id = u.user_id 
            WHERE g.status = ? 
            ORDER BY g.date_posted DESC
        ");
        $stmt->bind_param("s", $status);
        $stmt->execute();
        $result = $stmt->get_result();

        $images = [];
        while ($row = $result->fetch_assoc()) {
            $row['image_url'] = "../uploads/gallery/" . $row['image'];
            $images[] = $row;
        }

        echo json_encode([
            "success" => true,
            "data" => $images
        ]);
        exit;
    }

    echo json_encode(["success" => false, "message" => "Invalid GET request"]);
    exit;
}
?>
