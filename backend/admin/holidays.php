<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept JSON
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $_POST = json_decode(file_get_contents("php://input"), true);
}

/* ======================
   FETCH
====================== */
if ($method === "GET") {
    $result = $conn->query("SELECT * FROM holidays ORDER BY date ASC");

    echo json_encode([
        "success" => true,
        "data" => $result->fetch_all(MYSQLI_ASSOC)
    ]);
    exit;
}

/* ======================
   CREATE
====================== */
if ($_POST['action'] === "create") {
    $stmt = $conn->prepare("INSERT INTO holidays (name, date) VALUES (?, ?)");
    $stmt->bind_param("ss", $_POST['name'], $_POST['date']);
    $stmt->execute();
    echo json_encode(["success" => true]);
    exit;
}

/* ======================
   UPDATE
====================== */
if ($_POST['action'] === "update") {
    $stmt = $conn->prepare(
        "UPDATE holidays SET name = ?, date = ? WHERE id = ?"
    );
    $stmt->bind_param("ssi", $_POST['name'], $_POST['date'], $_POST['id']);
    $stmt->execute();
    echo json_encode(["success" => true]);
    exit;
}

/* ======================
   DELETE
====================== */
if ($_POST['action'] === "delete") {
    $stmt = $conn->prepare("DELETE FROM holidays WHERE id = ?");
    $stmt->bind_param("i", $_POST['id']);
    $stmt->execute();
    echo json_encode(["success" => true]);
    exit;
}
