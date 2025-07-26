<?php
// SnakkaZ MCP Health Check - CORS Enabled
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
    'status' => 'Active',
    'service' => 'SnakkaZ MCP',
    'timestamp' => date('c'),
    'cors' => 'enabled',
    'domain' => 'mcp.snakkaz.com',
    'health' => 'excellent'
];

echo json_encode($response);
?>
