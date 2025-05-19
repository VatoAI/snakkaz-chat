# cPanel API Token Deployment Guide

This guide explains how to set up secure deployment using cPanel API tokens for Snakkaz Chat.

## What are cPanel API Tokens?

cPanel API tokens provide a more secure way to authenticate with cPanel than using standard username/password credentials. They:

- Allow fine-grained access control
- Can be revoked easily without changing your main password
- Can have expiration dates set
- Provide better security than storing your main cPanel password in GitHub

## Creating a cPanel API Token

1. Log in to your cPanel account (usually at https://yourdomain.com:2083)
2. Go to "Security" > "Manage API Tokens"
3. Click the "Create" button
4. Enter a descriptive name like "GithubActionsDeployment"
5. Choose whether the token should expire or not
   - For production environments, it's recommended to set an expiration date and renew periodically
6. Click "Create" to generate the token
7. **IMPORTANT**: Copy the token immediately and store it safely - it will only be shown once!
8. Click "Yes, I Saved My Token" after securely storing your token

## Required GitHub Secrets

For the cPanel API token deployment to work, you need to add the following secrets to your GitHub repository:

1. `CPANEL_USERNAME`: Your cPanel username (usually the same as your hosting account username)
2. `CPANEL_API_TOKEN`: The API token you created in cPanel (not your regular password)
3. `CPANEL_DOMAIN`: Your cPanel domain with port (e.g., `premium123.web-hosting.com`)

## How to Add These Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" → "Actions"
4. Click on "New repository secret"
5. Add each of the required secrets:
   - Name: `CPANEL_USERNAME`  
     Value: `SnakkaZ` (or your actual cPanel username)
   - Name: `CPANEL_API_TOKEN`  
     Value: `U7HMR63FGY292DQZ4H5BFH16JLYMO01M` (your actual cPanel API token)
   - Name: `CPANEL_DOMAIN`  
     Value: `premium123.web-hosting.com` (may need to be adjusted for your hosting)

## Testing the cPanel API Token Connection

You can test your cPanel API token connection before running the GitHub Actions workflow by using the following command:

```bash
curl -H "Authorization: cpanel YOUR_USERNAME:YOUR_API_TOKEN" \
     "https://YOUR_CPANEL_DOMAIN:2083/execute/Fileman/list_files?dir=%2Fpublic_html"
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

1. **Authentication Failures**: 
   - Verify your cPanel username is correct
   - Ensure your API token has not expired
   - Check if the token has been revoked in cPanel

2. **Permission Issues**: 
   - Make sure the API token has appropriate permissions
   - You may need to create a new token with "Full Access" privileges

3. **Connection Issues**:
   - Ensure your CPANEL_DOMAIN is correct with the proper port (2083 for HTTPS)
   - Some hosts may use a different port for API access

4. **File Size Limits**: 
   - If your ZIP file is too large, check cPanel file upload size limits

5. **Token Expiration**:
   - If your deployment suddenly stops working, check if your API token has expired

## Renewing API Tokens

It's good security practice to periodically rotate your API tokens:

1. Create a new API token in cPanel
2. Update the `CPANEL_API_TOKEN` secret in GitHub with the new token
3. Test a deployment to ensure it works
4. Revoke the old token in cPanel

## Security Considerations

- Never share your API token or commit it to your repository
- Set an expiration date on your tokens when possible
- Revoke tokens immediately if they are compromised
- Use the minimum necessary permissions for your token (when cPanel supports this feature)
