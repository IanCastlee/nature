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
| FETCH FAQs (GET)
|---------------------------------------------------------------------------
*/
if ($method === "GET") {

    $stmt = $conn->prepare("
        SELECT 
            id,
            question_en,
            question_tl,
            answer_en,
            answer_tl,
            created_at
        FROM faqs
        ORDER BY created_at ASC
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    //  STANDARDIZED RESPONSE
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
    | CREATE FAQ
    */
    if ($action === "create") {

        $stmt = $conn->prepare("
            INSERT INTO faqs (question_en, question_tl, answer_en, answer_tl)
            VALUES (?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "ssss",
            $_POST['question_en'],
            $_POST['question_tl'],
            $_POST['answer_en'],
            $_POST['answer_tl']
        );

        $stmt->execute();

        echo json_encode(["success" => true]);
        exit;
    }

    /*
    | UPDATE FAQ
    */
    if ($action === "update") {

        $stmt = $conn->prepare("
            UPDATE faqs
            SET
                question_en = ?,
                question_tl = ?,
                answer_en = ?,
                answer_tl = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "ssssi",
            $_POST['question_en'],
            $_POST['question_tl'],
            $_POST['answer_en'],
            $_POST['answer_tl'],
            $_POST['id']
        );

        $stmt->execute();

        echo json_encode(["success" => true]);
        exit;
    }

    /*
    | DELETE FAQ
    */
    if ($action === "delete") {
        if (isset($_POST['id'])) {
            $stmt = $conn->prepare("DELETE FROM faqs WHERE id = ?");
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
