<?php
include("../header.php");
include("../dbConn.php");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Only POST method is allowed"]);
    exit;
}

// Accept JSON input
if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

// Extract values
$booking_id = $_POST["booking_id"] ?? null;
$status     = $_POST["status"] ?? null;
$difference = $_POST["difference"] ?? null; // Refund (+) or Charge (-)

if (!$booking_id || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Missing booking_id or status"]);
    exit;
}

// Response container
$response = [];

// Handle status
switch ($status) {

    case "approved":
        // New booking: approve and set paid = price / 2
        $stmt = $conn->prepare("
            UPDATE room_booking
            SET status = 'approved', paid = price / 2
            WHERE booking_id = ?
        ");
        $stmt->bind_param("i", $booking_id);
        break;

    case "resched":
        // Previous booking: set status = resched and update refund_or_charge
        if ($difference === null) {
            http_response_code(400);
            echo json_encode(["error" => "Missing difference for resched"]);
            exit;
        }
        $stmt = $conn->prepare("
            UPDATE room_booking
            SET status = 'resched', refund_charge = ?
            WHERE booking_id = ?
        ");
        $stmt->bind_param("di", $difference, $booking_id);
        break;

    default:
        // Other statuses: just update status
        $stmt = $conn->prepare("
            UPDATE room_booking
            SET status = ?
            WHERE booking_id = ?
        ");
        $stmt->bind_param("si", $status, $booking_id);
        break;
}

// Execute
if ($stmt->execute()) {
    $response["success"] = true;
    $response["message"] = $status === "approved" 
        ? "Booking approved and paid set to half of price."
        : ($status === "resched" 
            ? "Previous booking set to resched and refund_or_charge updated."
            : "Booking updated.");
} else {
    $response["success"] = false;
    $response["error"] = $stmt->error;
}

echo json_encode($response);
exit;
?>
