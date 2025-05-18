<?php
/**
 * serve-assets.php
 * 
 * This script serves asset files with the correct MIME types.
 * Use this as a fallback if .htaccess configuration isn't working.
 * 
 * Example usage:
 * <link href="serve-assets.php?file=index-ZtK66PHB.css" rel="stylesheet">
 * <script src="serve-assets.php?file=index-iEerSh2Y.js"></script>
 */

// Get the requested file name
$file = $_GET['file'] ?? '';

// Security check - prevent directory traversal
$file = str_replace('../', '', $file);
$file = str_replace('./', '', $file);

// Get file extension
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

// Define MIME types
$mimeTypes = [
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf' => 'font/ttf',
    'otf' => 'font/otf'
];

// Path to assets directory
$filePath = 'assets/' . $file;

// Check if file exists and has a supported MIME type
if (file_exists($filePath) && isset($mimeTypes[$ext])) {
    // Enable caching
    $etag = md5_file($filePath);
    $lastModified = gmdate('D, d M Y H:i:s', filemtime($filePath)) . ' GMT';
    
    header('ETag: "' . $etag . '"');
    header('Last-Modified: ' . $lastModified);
    header('Cache-Control: public, max-age=31536000');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
    
    // Check if browser cache is valid
    if (
        (isset($_SERVER['HTTP_IF_NONE_MATCH']) && $_SERVER['HTTP_IF_NONE_MATCH'] === $etag) ||
        (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] === $lastModified)
    ) {
        header('HTTP/1.1 304 Not Modified');
        exit;
    }
    
    // Set content type and serve file
    header('Content-Type: ' . $mimeTypes[$ext]);
    readfile($filePath);
    exit;
}

// If the file doesn't exist or has an unsupported extension
header('HTTP/1.0 404 Not Found');
echo 'File not found: ' . htmlspecialchars($file);
?>
