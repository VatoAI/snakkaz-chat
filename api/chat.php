<?php
// SnakkaZ MCP Chat API - CORS Enabled
header('Access-Control-Allow-Origin: https://snakkaz.com');
header('Access-Control-Allow-Origin: https://www.snakkaz.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [
    'response' => 'SnakkaZ MCP Chat is active and ready!',
    'timestamp' => date('c'),
    'cors' => 'working',
    'api' => 'functional'
];

echo json_encode($response);
?>
