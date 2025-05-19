# Setting Up cPanel API Deployment

This guide explains how to set up the cPanel API deployment for Snakkaz Chat.

## Required GitHub Secrets

For the cPanel API deployment to work, you need to add the following secrets to your GitHub repository:

1. `CPANEL_USERNAME`: Your cPanel username (usually the same as your FTP username)
2. `CPANEL_PASSWORD`: Your cPanel password (usually the same as your FTP password)
3. `CPANEL_URL`: Your cPanel URL with port (e.g., `premium123.web-hosting.com:2083`)

## How to Add These Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" → "Actions"
4. Click on "New repository secret"
5. Add each of the required secrets:
   - Name: `CPANEL_USERNAME`  
     Value: `SnakkaZ@snakkaz.com` (or your actual cPanel username)
   - Name: `CPANEL_PASSWORD`  
     Value: `Snakkaz2025!` (or your actual cPanel password)
   - Name: `CPANEL_URL`  
     Value: `premium123.web-hosting.com:2083` (may need to be adjusted for your hosting)

## How to Find Your cPanel URL

1. Log in to your Namecheap account
2. Go to "Hosting List"
3. Click "Manage" next to your hosting package
4. Look for "cPanel Admin" section
5. The URL will be something like `premium123.web-hosting.com:2083`

## Testing the cPanel Connection

You can test your cPanel connection before running the GitHub Actions workflow by using the following command:

```bash
curl -k -u "YOUR_CPANEL_USERNAME:YOUR_CPANEL_PASSWORD" "https://YOUR_CPANEL_URL/execute/Fileman/list_files?dir=/public_html"
```

If successful, this will return a JSON list of files in your public_html directory.

## Manual Extraction (If Needed)

If the automatic extraction in the workflow fails, you can manually extract the ZIP file by:

1. Log in to cPanel
2. Go to File Manager
3. Navigate to public_html
4. Find `snakkaz-dist.zip`
5. Select it and click "Extract"
6. Choose to extract to the current directory

## Troubleshooting

If you encounter issues:

1. **Authentication Failures**: Double-check your cPanel username and password
2. **Access Denied**: Make sure your cPanel access is enabled
3. **API Errors**: Some hosting providers may restrict certain API calls, contact Namecheap support if needed
4. **File Size Limits**: If your ZIP file is too large, check cPanel file upload size limits
