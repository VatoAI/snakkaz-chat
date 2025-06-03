<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Simple memory storage using JSON files
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$userId = $_GET['user_id'] ?? 'anonymous';
$memoryFile = $dataDir . '/memory_' . preg_replace('/[^a-zA-Z0-9_-]/', '', $userId) . '.json';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Retrieve memory
        if (file_exists($memoryFile)) {
            $memory = json_decode(file_get_contents($memoryFile), true);
        } else {
            $memory = [
                'user_id' => $userId,
                'conversations' => [],
                'preferences' => [],
                'created_at' => date('c'),
                'last_updated' => date('c')
            ];
        }
        echo json_encode($memory, JSON_PRETTY_PRINT);
        break;
        
    case 'POST':
        // Store memory
        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($input) {
            $memory = [
                'user_id' => $userId,
                'conversations' => $input['conversations'] ?? [],
                'preferences' => $input['preferences'] ?? [],
                'created_at' => $input['created_at'] ?? date('c'),
                'last_updated' => date('c')
            ];
            
            file_put_contents($memoryFile, json_encode($memory, JSON_PRETTY_PRINT));
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Memory updated successfully',
                'user_id' => $userId,
                'timestamp' => date('c')
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>
