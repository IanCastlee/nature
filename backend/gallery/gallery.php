<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Allow JSON body
if ($method === "POST" && isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (is_array($input)) {
        $_POST = array_merge($_POST, $input);
    }
}

//
//  UPLOAD IMAGES WITH CAPTION
//
if ($method === "POST" && isset($_FILES) && !empty($_FILES)) {
    $uploadDir = "../uploads/gallery/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $uploadedFiles = [];
    $index = 0;

    foreach ($_FILES as $file) {
        if ($file['error'] === UPLOAD_ERR_OK) {

            $tmpName = $file['tmp_name'];
            $filename = basename($file['name']);
            $uniqueFilename = time() . "_" . uniqid() . "_" . $filename;
            $targetPath = $uploadDir . $uniqueFilename;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $datePosted = date("Y-m-d H:i:s");

                // caption0, caption1...
                $captionKey = "caption" . $index;
                $caption = isset($_POST[$captionKey]) ? $_POST[$captionKey] : null;

                $stmt = $conn->prepare("INSERT INTO gallery (image, caption, date_posted, status) VALUES (?, ?, ?, 'posted')");
                $stmt->bind_param("sss", $uniqueFilename, $caption, $datePosted);
                $stmt->execute();
                $stmt->close();

                $uploadedFiles[] = [
                    "image" => $uniqueFilename,
                    "caption" => $caption,
                    "date_posted" => $datePosted,
                    "status" => "pending"
                ];
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to upload " . $filename
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
        $index++;
    }

    echo json_encode([
        "success" => true,
        "message" => "Images uploaded successfully.",
        "data" => $uploadedFiles
    ]);
    exit;
}


// =======================================
// DELETE GALLERY IMAGE (DB + FILE)
// =======================================
if ($method === "POST" && isset($_POST['action']) && $_POST['action'] === "set_delete") {

    $id = intval($_POST['id']);
    $uploadDir = "../uploads/gallery/";

    //  Get image filename
    $stmt = $conn->prepare("SELECT image FROM gallery WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $imageData = $result->fetch_assoc();
    $stmt->close();

    if (!$imageData) {
        echo json_encode([
            "success" => false,
            "message" => "Image not found."
        ]);
        exit;
    }

    $fileName = $imageData['image']; // filename only
    $filePath = $uploadDir . $fileName;

    //  Delete actual file
    if ($fileName && file_exists($filePath)) {
        unlink($filePath);
    }

    //  Delete DB record
    $stmt = $conn->prepare("DELETE FROM gallery WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Image deleted successfully."
    ]);

    exit;
}

//
//  GET IMAGES
//
if ($method === "GET") {
    $status = isset($_GET['status']) ? $_GET['status'] : "";

    if ($status) {
        $stmt = $conn->prepare("SELECT * FROM gallery WHERE status = ? ORDER BY date_posted DESC");
        $stmt->bind_param("s", $status);
    } else {
        $stmt = $conn->prepare("SELECT * FROM gallery ORDER BY date_posted DESC");
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $list = [];
    while ($row = $result->fetch_assoc()) {
        $row["image_url"] = "../uploads/gallery/" . $row["image"];
        $list[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $list
    ]);
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid request"]);
exit;
?>
