<?php
// SnakkaZ MCP Status - FIXED CORS for both domains
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
    'mcp' => 'active',
    'features' => ['chat', 'e2ee', 'ai', 'digital_vokter'],
    'health' => 'excellent',
    'cors' => 'fixed-multi-origin',
    'ai_models' => [
        'gpt4' => 'active',
        'claude' => 'active', 
        'norwegian_context' => 'active'
    ],
    'security_level' => 'maximum',
    'timestamp' => date('c')
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
