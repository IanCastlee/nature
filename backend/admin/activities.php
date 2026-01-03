<?php
include("../header.php");
include("../dbConn.php");

header('Content-Type: application/json');

/**
 * ==========================
 * HANDLE JSON BODY
 * ==========================
 */
$rawInput = file_get_contents("php://input");
$jsonData = json_decode($rawInput, true);

if (is_array($jsonData)) {
    $_POST = array_merge($_POST, $jsonData);
}

$action = $_POST['action'] ?? "";

/**
 * ==========================
 * CREATE ACTIVITY
 * ==========================
 */
if ($action === "create") {

    if (
        empty($_POST['title']) ||
        empty($_POST['subtitle']) ||
        !isset($_FILES['image'])
    ) {
        http_response_code(400);
        echo json_encode(["message" => "All fields are required"]);
        exit;
    }

    $uploadDir = "../uploads/activities/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $file = $_FILES['image'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = uniqid("activity_") . "." . $ext;

    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
        http_response_code(500);
        echo json_encode(["message" => "Image upload failed"]);
        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO activities (title, subtitle, image) VALUES (?, ?, ?)"
    );
    $stmt->bind_param("sss", $_POST['title'], $_POST['subtitle'], $fileName);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}

/**
 * ==========================
 * UPDATE ACTIVITY
 * ==========================
 */
if ($action === "update") {

    if (
        empty($_POST['id']) ||
        empty($_POST['title']) ||
        empty($_POST['subtitle'])
    ) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $id = $_POST['id'];

    $stmt = $conn->prepare("SELECT image FROM activities WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $oldData = $stmt->get_result()->fetch_assoc();

    if (!$oldData) {
        http_response_code(404);
        echo json_encode(["message" => "Activity not found"]);
        exit;
    }

    $fileName = $oldData['image'];

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

        $uploadDir = "../uploads/activities/";

        if ($fileName && file_exists($uploadDir . $fileName)) {
            unlink($uploadDir . $fileName);
        }

        $file = $_FILES['image'];
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = uniqid("activity_") . "." . $ext;

        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
            http_response_code(500);
            echo json_encode(["message" => "Image upload failed"]);
            exit;
        }
    }

    $stmt = $conn->prepare(
        "UPDATE activities SET title = ?, subtitle = ?, image = ? WHERE id = ?"
    );
    $stmt->bind_param("sssi", $_POST['title'], $_POST['subtitle'], $fileName, $id);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}

/**
 * ==========================
 * DELETE ACTIVITY ✅ FIXED
 * ==========================
 */
if ($action === "delete") {

    if (empty($_POST['id'])) {
        http_response_code(400);
        echo json_encode(["message" => "ID required"]);
        exit;
    }

    $id = $_POST['id'];

    // Get image
    $stmt = $conn->prepare("SELECT image FROM activities WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $data = $stmt->get_result()->fetch_assoc();

    if ($data && !empty($data['image'])) {
        $filePath = "../uploads/activities/" . $data['image'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    $stmt = $conn->prepare("DELETE FROM activities WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}

/**
 * ==========================
 * GET ALL ACTIVITIES
 * ==========================
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM activities ORDER BY id DESC");
    $activities = [];

    while ($row = $result->fetch_assoc()) {
        $activities[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $activities
    ]);
    exit;
}
