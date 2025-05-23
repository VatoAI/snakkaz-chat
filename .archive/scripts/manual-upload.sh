#!/bin/bash
# Manual upload script for Snakkaz Chat app

# Load FTP credentials from .env
if [ -f ".env" ]; then
  echo "Loading FTP credentials from .env file..."
  source .env
else
  echo "No .env file found. Please enter FTP credentials manually."
  read -p "Enter FTP host: " FTP_HOST
  read -p "Enter FTP username: " FTP_USER
  read -s -p "Enter FTP password: " FTP_PASS
  echo
  read -p "Enter remote directory (e.g., public_html): " FTP_REMOTE_DIR
fi

echo "Preparing for deployment..."
# Make sure to delete old service workers before uploading
echo "// Empty service worker to unregister old ones
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.navigate(client.url));
  });
});" > dist/service-worker.js

echo "Creating assets directory on the server..."
curl -s -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" -Q "MKD $FTP_REMOTE_DIR/assets"

echo "Uploading service-worker.js first to unregister old service workers..."
curl -T dist/service-worker.js -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/"

echo "Uploading index.html..."
curl -T dist/index.html -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/"

echo "Uploading .htaccess..."
curl -T dist/.htaccess -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/"

echo "Uploading mime-test.js..."
curl -T dist/mime-test.js -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/"

echo "Uploading assets files one by one..."
for file in dist/assets/*; do
  filename=$(basename "$file")
  echo "Uploading $filename..."
  curl -T "$file" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/"
  sleep 0.2 # Small delay to prevent overloading the server
done

# Clear browser cache instructions
echo "============================================================="
echo "Deployment completed!"
echo "============================================================="
echo "IMPORTANT: To verify the site, CLEAR YOUR BROWSER CACHE first:"
echo "1. Open Chrome DevTools (F12)"
echo "2. Right-click the reload button and select 'Empty Cache and Hard Reload'"
echo "3. Or use Ctrl+Shift+Delete to clear browser cache"
echo "Then visit https://snakkaz.com to verify the site is working correctly."
