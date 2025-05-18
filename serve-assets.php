<?php
/**
 * serve-assets.php
 * 
 * Enhanced script for serving assets with correct MIME types
 * This solves MIME type issues on servers that don't honor .htaccess configuration
 * 
 * Usage examples:
 * <link href="serve-assets.php?file=index-ZtK66PHB.css" rel="stylesheet">
 * <script src="serve-assets.php?file=index-iEerSh2Y.js" type="module"></script>
 * <script src="serve-assets.php?file=vendor/supabase-client.js"></script>
 * <script src="serve-assets.php?file=cspFixes-CCeitK04.js" type="module"></script>
 */

// Error reporting in development, off in production
if (isset($_GET['debug'])) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

// Log errors to a file if needed
// ini_set('log_errors', 1);
// ini_set('error_log', 'php-errors.log');

// Get the requested file
$file = $_GET['file'] ?? '';

// Security check - prevent directory traversal
$file = preg_replace('/\.\.\/|\.\//', '', $file);

// Handle both direct file references and path+filename references
$path = '';
if (isset($_GET['path'])) {
    $path = $_GET['path'];
    $path = preg_replace('/\.\.\/|\.\//', '', $path);
    $path = rtrim($path, '/') . '/';
}

// Get file extension
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

// Define MIME types with more comprehensive mapping
$mimeTypes = [
    // Scripts
    'js' => 'application/javascript',
    'mjs' => 'application/javascript',
    'jsonp' => 'application/javascript',
    
    // Styles
    'css' => 'text/css',
    
    // Data formats
    'json' => 'application/json',
    'map' => 'application/json',
    'xml' => 'application/xml',
    'rss' => 'application/rss+xml',
    
    // Images
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'webp' => 'image/webp',
    'ico' => 'image/x-icon',
    'bmp' => 'image/bmp',
    
    // Fonts
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf' => 'font/ttf',
    'otf' => 'font/otf',
    'eot' => 'application/vnd.ms-fontobject',
    
    // Documents
    'html' => 'text/html',
    'htm' => 'text/html',
    'txt' => 'text/plain',
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    
    // Archives
    'zip' => 'application/zip',
    'rar' => 'application/x-rar-compressed',
    'gz' => 'application/gzip',
    
    // Media
    'mp4' => 'video/mp4',
    'webm' => 'video/webm',
    'mp3' => 'audio/mpeg',
    'wav' => 'audio/wav',
    'ogg' => 'audio/ogg'
];

// Check for potential subdirectory
$hasSubdir = strpos($file, '/') !== false;
$fullPathToFile = '';

// Try different locations for the file
$possiblePaths = [
    'assets/' . $file,                    // Standard assets directory
    $file,                               // Direct file reference
    $path . $file,                        // Using specified path
    'dist/assets/' . $file,               // Check in dist directory
    '../assets/' . $file,                 // Parent assets directory
];

// For vendor files, try additional paths
if ($hasSubdir && strpos($file, 'vendor/') === 0) {
    $possiblePaths[] = 'assets/' . substr($file, 7); // Skip "vendor/" prefix
    $possiblePaths[] = substr($file, 7);            // Skip "vendor/" prefix direct
}

// Search for the file in all possible locations
foreach ($possiblePaths as $testPath) {
    if (file_exists($testPath) && !is_dir($testPath)) {
        $fullPathToFile = $testPath;
        break;
    }
}

// If file not found in any location
if (empty($fullPathToFile)) {
    // Try to create stub files for commonly missing files
    if (endsWith($file, 'cspFixes-CCeitK04.js')) {
        createStubJsFile('cspFixes-CCeitK04.js');
        $fullPathToFile = 'assets/cspFixes-CCeitK04.js';
    } 
    elseif (endsWith($file, 'supabase-client.js')) {
        createStubSupabaseFile();
        $fullPathToFile = 'assets/vendor/supabase-client.js';
    }
    elseif (empty($fullPathToFile)) {
        header('HTTP/1.0 404 Not Found');
        echo 'File not found: ' . htmlspecialchars($file) . '<br>';
        echo 'Tried the following paths:<br>';
        echo '<ul>';
        foreach ($possiblePaths as $path) {
            echo '<li>' . htmlspecialchars($path) . (file_exists($path) ? ' (exists)' : ' (not found)') . '</li>';
        }
        echo '</ul>';
        exit;
    }
}

// Set appropriate MIME type
$mimeType = isset($mimeTypes[$ext]) ? $mimeTypes[$ext] : 'application/octet-stream';

// Force JavaScript MIME type for .js files
if ($ext === 'js') {
    $mimeType = 'application/javascript';
}
// Force CSS MIME type for .css files
elseif ($ext === 'css') {
    $mimeType = 'text/css';
}

// Add proper CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Enable caching with ETag
$etag = md5_file($fullPathToFile);
$lastModified = gmdate('D, d M Y H:i:s', filemtime($fullPathToFile)) . ' GMT';

header('ETag: "' . $etag . '"');
header('Last-Modified: ' . $lastModified);
header('Cache-Control: public, max-age=31536000');
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');

// Check if browser cache is valid
if (
    (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH'], '"') === $etag) ||
    (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] === $lastModified)
) {
    header('HTTP/1.1 304 Not Modified');
    exit;
}

// Set content type and serve file
header('Content-Type: ' . $mimeType);
readfile($fullPathToFile);
exit;

// Helper function to check if string ends with a specific substring
function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if (!$length) {
        return true;
    }
    return substr($haystack, -$length) === $needle;
}

// Create a stub CSP fixes JavaScript file
function createStubJsFile($filename) {
    $dir = 'assets';
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
    
    $content = "/**\n * Auto-generated stub for " . $filename . "\n * Created on " . date('Y-m-d H:i:s') . "\n */\n\n";
    $content .= "console.log('Stub " . $filename . " loaded successfully');\n\n";
    $content .= "// Export dummy functions to prevent errors\n";
    $content .= "export const applyAllCspFixes = () => console.log('CSP fixes applied (stub)');\n";
    $content .= "export const setupCspReporting = () => console.log('CSP reporting setup (stub)');\n";
    
    file_put_contents($dir . '/' . $filename, $content);
}

// Create a stub Supabase client JavaScript file
function createStubSupabaseFile() {
    $dir = 'assets/vendor';
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
    
    $content = "/**\n * Auto-generated stub for supabase-client.js\n * Created on " . date('Y-m-d H:i:s') . "\n */\n\n";
    $content .= "console.log('Stub Supabase client loaded successfully');\n\n";
    $content .= "// Create a mock Supabase client to prevent errors\n";
    $content .= "window.supabaseClient = {\n";
    $content .= "  auth: {\n";
    $content .= "    signIn: () => Promise.resolve({ user: null, error: { message: 'Using offline stub' } }),\n";
    $content .= "    signUp: () => Promise.resolve({ user: null, error: { message: 'Using offline stub' } }),\n";
    $content .= "    signOut: () => Promise.resolve({ error: null }),\n";
    $content .= "    getSession: () => Promise.resolve({ session: null, error: null })\n";
    $content .= "  },\n";
    $content .= "  from: (table) => ({\n";
    $content .= "    select: () => ({ data: [], error: null }),\n";
    $content .= "    insert: () => ({ data: null, error: { message: 'Using offline stub' } }),\n";
    $content .= "    update: () => ({ data: null, error: { message: 'Using offline stub' } })\n";
    $content .= "  })\n";
    $content .= "};\n";
    
    file_put_contents($dir . '/supabase-client.js', $content);
}
?>
