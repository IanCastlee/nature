<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

header('Content-Type: application/json');

try {
    if ($method === 'POST') {

        // ------------------- Delete Hero Image -------------------
        if (isset($_POST['delete_hero_id'])) {
            $delete_id = intval($_POST['delete_hero_id']);

            // Get the file name from DB
            $stmt = $conn->prepare("SELECT image FROM hero_images WHERE id=?");
            $stmt->bind_param("i", $delete_id);
            $stmt->execute();
            $res = $stmt->get_result();

            if ($res->num_rows > 0) {
                $row = $res->fetch_assoc();
                $file = "../uploads/hero/" . $row['image'];

                // Delete file from filesystem
                if (file_exists($file)) unlink($file);

                // Delete from database
                $stmt = $conn->prepare("DELETE FROM hero_images WHERE id=?");
                $stmt->bind_param("i", $delete_id);
                $stmt->execute();

                echo json_encode([
                    "success" => true,
                    "message" => "Hero image deleted successfully."
                ]);
                exit;
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Hero image not found."
                ]);
                exit;
            }
        }

        // ------------------- Normal Update -------------------
        $hero_heading = $_POST['hero_heading'] ?? '';
        $hero_subheading = $_POST['hero_subheading'] ?? '';
        $email = $_POST['email'] ?? '';
        $globe_no = $_POST['globe_no'] ?? '';
        $smart_no = $_POST['smart_no'] ?? '';

        // ------------------- Logo Upload -------------------
        $logoPath = null;
        if (!empty($_FILES['logo']['name'])) {
            $uploadDir = "../uploads/logo/";
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $tmpName = $_FILES['logo']['tmp_name'];
            $fileName = uniqid() . "_" . basename($_FILES['logo']['name']);
            $targetFile = $uploadDir . $fileName;

            if (move_uploaded_file($tmpName, $targetFile)) {
                $logoPath = $fileName;
            }
        }

        // ------------------- Update Settings -------------------
        $sql = "UPDATE `setting` SET hero_heading=?, hero_subheading=?, email=?, globe_no=?, smart_no=?";
        if (!empty($logoPath)) $sql .= ", logo=?";
        $sql .= " WHERE id=1";

        $stmt = $conn->prepare($sql);
        if (!empty($logoPath)) {
            $stmt->bind_param("ssssss", $hero_heading, $hero_subheading, $email, $globe_no, $smart_no, $logoPath);
        } else {
            $stmt->bind_param("sssss", $hero_heading, $hero_subheading, $email, $globe_no, $smart_no);
        }
        $stmt->execute();

        // ------------------- Hero Images Upload (max 5) -------------------
        if (!empty($_FILES['hero_images']['name'][0])) {
            $uploadDir = "../uploads/hero/";
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $count = min(count($_FILES['hero_images']['name']), 5);
            for ($i = 0; $i < $count; $i++) {
                $tmpName = $_FILES['hero_images']['tmp_name'][$i];
                $fileName = uniqid() . "_" . basename($_FILES['hero_images']['name'][$i]);
                $targetFile = $uploadDir . $fileName;

                if (move_uploaded_file($tmpName, $targetFile)) {
                    $stmt = $conn->prepare("INSERT INTO `hero_images` (image) VALUES (?)");
                    $stmt->bind_param("s", $fileName);
                    $stmt->execute();
                }
            }
        }

        echo json_encode([
            "success" => true,
            "message" => "Settings updated successfully."
        ]);
        exit;
    }

    // ------------------- GET Current Settings -------------------
    $result = $conn->query("SELECT * FROM `setting` WHERE id=1");
    $settings = $result->fetch_assoc();

    $imagesResult = $conn->query("SELECT * FROM `hero_images` ORDER BY id DESC");
    $hero_images = [];
    while ($row = $imagesResult->fetch_assoc()) {
        $hero_images[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => array_merge($settings, ["hero_images" => $hero_images]),
        "message" => ""
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "data" => null,
        "message" => $e->getMessage()
    ]);
}
