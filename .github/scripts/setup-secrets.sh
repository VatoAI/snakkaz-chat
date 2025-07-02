#!/bin/bash
# Script to help setup GitHub repository secrets

echo "🔐 GITHUB SECRETS SETUP GUIDE"
echo "============================="
echo ""
echo "Required secrets for GitHub Actions:"
echo ""
echo "1. FTP_HOST: ftp.snakkaz.com"
echo "2. FTP_USER: admin@snakkaz.com" 
echo "3. FTP_PASS: [Your FTP password]"
echo ""
echo "To add secrets:"
echo "1. Go to: https://github.com/VatoAI/snakkaz-chat/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Add each secret above"
echo ""
echo "🚀 After adding secrets, workflows will deploy automatically!"
