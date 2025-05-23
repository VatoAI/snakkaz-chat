#!/bin/bash

# Script to fix build errors in Snakkaz Chat
# Created: May 22, 2025

echo "Starting build error fixes for Snakkaz Chat..."

# Fix import paths in encryptionService.ts
echo "Fixing import paths in encryptionService.ts..."
sed -i "s|from './cryptoUtils'|from '@/services/encryption/cryptoUtils'|g" ./src/utils/encryption/encryptionService.ts
sed -i "s|from './offlinePageEncryption'|from '@/services/encryption/offlinePageEncryption'|g" ./src/utils/encryption/encryptionService.ts

# Fix import paths in keyStorageService.ts
echo "Fixing import paths in keyStorageService.ts..."
sed -i "s|from './cryptoUtils'|from '@/services/encryption/cryptoUtils'|g" ./src/utils/encryption/keyStorageService.ts

# Fix broken comment in keyStorageService.ts 
sed -i '1,10s|Provides secure storage a    // Parse JWK and import the key\n    const jwk = JSON.parse(keyData);\n    const key = await importKeyFromJwk(jwk, KeyType.AES_GCM, \[KeyUsage.ENCRYPT, KeyUsage.DECRYPT\]);retrieval of encryption keys|Provides secure storage and retrieval of encryption keys|g' ./src/utils/encryption/keyStorageService.ts

# Install required dependencies
echo "Installing required dependencies..."
npm install --save @uppy/react @uppy/core @uppy/dashboard tweetnacl tweetnacl-util

echo "Build error fixes completed!"
echo "Now you can run: npm run build"
