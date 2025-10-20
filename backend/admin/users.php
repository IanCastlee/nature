<?php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent
if ($method === "POST" && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

if ($method === "GET") {
    $status = $_GET['status'] ?? null;

    if($status == 0){
     $stmt = $conn->prepare("SELECT * FROM users WHERE email_verified = ? AND acc_type  != 0");
     $stmt->bind_param('i', $status);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
    }

     if($status == 1){
     $stmt = $conn->prepare("SELECT * FROM users WHERE email_verified = ? AND acc_type  != 0");
     $stmt->bind_param('i', $status);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
    }



   
}

?>
