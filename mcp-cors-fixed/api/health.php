<?php
// SnakkaZ MCP Health Check - FIXED CORS for both domains
$allowed_origins = [
    'https://snakkaz.com',
    'https://www.snakkaz.com',
    'http://localhost:5173', // Development
    'http://localhost:3000'  // Development
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [
    'status' => 'healthy',
    'service' => 'SnakkaZ MCP API',
    'timestamp' => date('c'),
    'cors' => 'fixed-multi-origin',
    'domain' => 'mcp.snakkaz.com',
    'health' => 'excellent',
    'origin_allowed' => $origin,
    'api_version' => '1.0'
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
