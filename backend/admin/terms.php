<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept JSON input
if ($method === "POST" && isset($_SERVER["CONTENT_TYPE"]) &&
    strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
}

/*
|---------------------------------------------------------------------------
| FETCH TERMS (GET)
|---------------------------------------------------------------------------
*/
if ($method === "GET") {

    $stmt = $conn->prepare("
        SELECT 
            id,
            title_en,
            title_tl,
            content_en,
            content_tl,
            created_at,
            updated_at,
            is_active
        FROM terms
        ORDER BY created_at ASC
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // STANDARDIZED RESPONSE
    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
}

/*
|---------------------------------------------------------------------------
| CREATE / UPDATE / DELETE (POST)
|---------------------------------------------------------------------------
*/
if ($method === "POST") {

    $action = $_POST['action'] ?? '';

    /*
    | CREATE TERM
    */
    if ($action === "create") {

        $stmt = $conn->prepare("
            INSERT INTO terms (title_en, title_tl, content_en, content_tl)
            VALUES (?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "ssss",
            $_POST['title_en'],
            $_POST['title_tl'],
            $_POST['content_en'],
            $_POST['content_tl']
        );

        $stmt->execute();

        echo json_encode(["success" => true]);
        exit;
    }

    /*
    | UPDATE TERM
    */
    if ($action === "update") {

        $stmt = $conn->prepare("
            UPDATE terms
            SET
                title_en = ?,
                title_tl = ?,
                content_en = ?,
                content_tl = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "ssssi",
            $_POST['title_en'],
            $_POST['title_tl'],
            $_POST['content_en'],
            $_POST['content_tl'],
            $_POST['id']
        );

        $stmt->execute();

        echo json_encode(["success" => true]);
        exit;
    }

    /*
    | DELETE TERM
    */
    if ($action === "delete") {
        if (isset($_POST['id'])) {
            $stmt = $conn->prepare("DELETE FROM terms WHERE id = ?");
            $stmt->bind_param("i", $_POST['id']);
            $stmt->execute();

            echo json_encode(["success" => true]);
            exit;
        } else {
            echo json_encode(["success" => false, "message" => "ID missing"]);
            exit;
        }
    }
}

/*
|---------------------------------------------------------------------------
| INVALID REQUEST
|---------------------------------------------------------------------------
*/
http_response_code(400);
echo json_encode(["success" => false]);
