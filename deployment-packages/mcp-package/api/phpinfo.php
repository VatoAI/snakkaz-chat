<?php
// Basic PHP info file
header('Content-Type: text/plain');

echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script Filename: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
echo "Current Working Directory: " . getcwd() . "\n";

echo "\nDirectory Listing:\n";
$files = scandir('.');
foreach ($files as $file) {
    echo "- $file\n";
}

echo "\nEnvironment:\n";
print_r($_ENV);

echo "\nServer Variables:\n";
print_r($_SERVER);
?>
