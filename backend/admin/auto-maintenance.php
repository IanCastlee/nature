<?php
// auto-maintenance.php
include("../header.php");
include("../dbConn.php");

$method = $_SERVER['REQUEST_METHOD'];

// Accept raw JSON if sent (for future use or manual triggering)
if ($method === "POST" && isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
    $input = json_decode(file_get_contents("php://input"), true);
    $_POST = $input;
}

// --- Auto Maintenance Logic ---

try {
    // Select rooms that haven't been maintained in 80 days or more
    $sql = "SELECT room_id FROM rooms WHERE DATEDIFF(CURDATE(), last_maintenance) >= 80";
    $result = $conn->query($sql);

    $updatedRooms = [];

    if ($result && $result->num_rows > 0) {
        // Update their status and reset last_maintenance date
        $update = "UPDATE rooms 
                   SET status = 'under maintenance', 
                       last_maintenance = CURDATE()
                   WHERE DATEDIFF(CURDATE(), last_maintenance) >= 80";

        if ($conn->query($update) === TRUE) {
            // Collect updated room IDs
            while ($row = $result->fetch_assoc()) {
                $updatedRooms[] = $row['room_id'];
            }

            echo json_encode([
                "status" => "success",
                "message" => "Rooms updated to under maintenance.",
                "updated_rooms" => $updatedRooms
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to update rooms: " . $conn->error
            ]);
        }
    } else {
        echo json_encode([
            "status" => "ok",
            "message" => "No rooms require maintenance today."
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$conn->close();
?>
