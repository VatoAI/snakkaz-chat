<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$response = [
    'status' => 'healthy',
    'timestamp' => date('c'),
    'service' => 'Snakkaz MCP API',
    'version' => '1.0.0',
    'features' => [
        'memory_storage' => true,
        'chat_history' => true,
        'user_preferences' => true
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
