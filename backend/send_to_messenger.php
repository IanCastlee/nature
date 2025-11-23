<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$imageUrl = $data['imageUrl'];
$name = $data['name'];
$phone = $data['phone'];

$PAGE_ID = "YOUR_FACEBOOK_PAGE_ID";  
$PAGE_ACCESS_TOKEN = "YOUR_PAGE_ACCESS_TOKEN";

// Text message with user info
$textMessage = [
    "recipient" => ["id" => $PAGE_ID],
    "message" => [
        "text" => "📩 New Summary Request\nName: $name\nPhone: $phone"
    ]
];

// Image summary message
$imageMessage = [
    "recipient" => ["id" => $PAGE_ID],
    "message" => [
        "attachment" => [
            "type" => "image",
            "payload" => [
                "url" => $imageUrl,
                "is_reusable" => false
            ]
        ]
    ]
];

// ---- Send text ----
$ch = curl_init("https://graph.facebook.com/v18.0/me/messages?access_token=$PAGE_ACCESS_TOKEN");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($textMessage));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_exec($ch);
curl_close($ch);

// ---- Send image ----
$ch = curl_init("https://graph.facebook.com/v18.0/me/messages?access_token=$PAGE_ACCESS_TOKEN");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($imageMessage));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
$response = curl_exec($ch);
curl_close($ch);

echo json_encode(["status" => "success", "response" => $response]);
?>
