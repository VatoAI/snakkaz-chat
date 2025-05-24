<?php
/**
 * Improved extraction script for Snakkaz Chat deployment
 * 
 * This script extracts the ZIP file containing the application files
 * and provides detailed error reporting for troubleshooting.
 */

// Output only plain text
header('Content-Type: text/plain');

// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "=== Snakkaz Chat Extraction Script ===\n\n";

// Check if ZIP file exists
if (!file_exists('snakkaz-dist.zip')) {
    echo "ERROR: snakkaz-dist.zip file not found!\n";
    exit(1);
}

echo "ZIP file found, checking size: " . filesize('snakkaz-dist.zip') . " bytes\n";

// Create a backup of the .htaccess file if it exists
if (file_exists('.htaccess')) {
    echo "Creating backup of existing .htaccess file...\n";
    if (copy('.htaccess', '.htaccess.backup-' . date('YmdHis'))) {
        echo "✅ Backup created successfully\n";
    } else {
        echo "⚠️ Failed to backup .htaccess file\n";
    }
}

// Create ZipArchive object
$zip = new ZipArchive;

// Open the ZIP file
echo "Opening ZIP archive...\n";
$res = $zip->open('snakkaz-dist.zip');

if ($res === TRUE) {
    // Extract the contents
    echo "Extracting files to current directory...\n";
    
    // Count files before extraction
    $filesBefore = count(glob('*')) + count(glob('.*')) - 2; // Exclude . and ..
    
    // Extract all files
    $zip->extractTo('.');
    $zip->close();
    
    // Count files after extraction
    $filesAfter = count(glob('*')) + count(glob('.*')) - 2; // Exclude . and ..
    $filesExtracted = $filesAfter - $filesBefore;
    
    echo "✅ Extraction successful! Extracted $filesExtracted new files/directories.\n";
    
    // Verify key files exist
    $requiredFiles = ['index.html', '.htaccess', 'assets'];
    $missing = [];
    
    foreach ($requiredFiles as $file) {
        if (!file_exists($file)) {
            $missing[] = $file;
        }
    }
    
    if (empty($missing)) {
        echo "✅ All required files are present.\n";
    } else {
        echo "⚠️ Some required files are missing: " . implode(', ', $missing) . "\n";
    }
    
    // Delete extraction script for security
    echo "Cleaning up...\n";
    echo "NOTE: After verification, please delete this extract.php script and the ZIP file.\n";
    
    echo "\n=== DEPLOYMENT COMPLETE ===\n";
    echo "Snakkaz Chat has been successfully deployed!\n";
} else {
    echo "❌ Failed to extract ZIP file!\n";
    echo "Error code: $res\n";
    
    // Show error messages based on ZipArchive error codes
    switch ($res) {
        case ZipArchive::ER_NOENT:
            echo "File not found.\n";
            break;
        case ZipArchive::ER_NOZIP:
            echo "Not a zip archive.\n";
            break;
        case ZipArchive::ER_INCONS:
            echo "Zip archive inconsistent.\n";
            break;
        case ZipArchive::ER_MEMORY:
            echo "Memory allocation failure.\n";
            break;
        case ZipArchive::ER_OPEN:
            echo "Can't open file.\n";
            break;
        case ZipArchive::ER_READ:
            echo "Read error.\n";
            break;
        case ZipArchive::ER_SEEK:
            echo "Seek error.\n";
            break;
        default:
            echo "Unknown error.\n";
    }
    
    // Check ZIP file integrity
    echo "\nZIP file details:\n";
    echo "File exists: " . (file_exists('snakkaz-dist.zip') ? 'Yes' : 'No') . "\n";
    echo "File size: " . filesize('snakkaz-dist.zip') . " bytes\n";
    echo "File permissions: " . substr(sprintf('%o', fileperms('snakkaz-dist.zip')), -4) . "\n";
    
    // Check PHP version and extensions
    echo "\nEnvironment details:\n";
    echo "PHP Version: " . phpversion() . "\n";
    echo "ZipArchive available: " . (class_exists('ZipArchive') ? 'Yes' : 'No') . "\n";
    
    // Try to get more info about the ZIP file
    if (class_exists('ZipArchive') && file_exists('snakkaz-dist.zip')) {
        $info = new ZipArchive();
        if ($info->open('snakkaz-dist.zip')) {
            echo "ZIP file can be opened. Contains " . $info->numFiles . " files.\n";
            $info->close();
        }
    }
}
?>
