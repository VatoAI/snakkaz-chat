/**
 * E2EE Test Utility
 * 
 * This utility provides testing functions for the group-e2ee implementation.
 * It helps with debugging and verifying that encryption/decryption works correctly.
 */

import * as GroupE2EE from '../../utils/encryption/group-e2ee';
import { storeKey, retrieveKey } from './keyStorageService';

/**
 * Test the full flow of group E2EE
 */
export async function testGroupE2EE() {
  const testResults = {
    success: true,
    steps: [] as {step: string, passed: boolean, error?: string}[],
    groupKeyId: '' // Legg til felt for groupKeyId
  };

  try {
    console.log('-----------------------------------');
    console.log('Starting Group E2EE Test');
    console.log('-----------------------------------');
    
    // Step 1: Generate a group key
    console.log('Step 1: Generating group key');
    const groupId = 'test-group-' + Date.now();
    const creatorId = 'test-user-' + Date.now();
    
    const { key, groupKey } = await GroupE2EE.generateGroupKey(groupId, creatorId);
    testResults.steps.push({
      step: 'Generate group key',
      passed: !!key && !!groupKey
    });
    
    console.log('Generated key ID:', groupKey.keyId);
    
    // Lagre keyId i resultater
    testResults.groupKeyId = groupKey.keyId;
    
    // Step 2: Store the key
    console.log('Step 2: Storing key');
    await storeKey(groupKey.keyId, key);
    
    // Verify we can retrieve it
    const retrievedKey = await retrieveKey(groupKey.keyId);
    testResults.steps.push({
      step: 'Store and retrieve key',
      passed: !!retrievedKey
    });
    
    // Step 3: Encrypt a message
    console.log('Step 3: Encrypting message');
    const testMessage = 'This is a test message for E2EE! 🔒';
    const { encryptedData, iv } = await GroupE2EE.encryptGroupMessage(testMessage, key);
    testResults.steps.push({
      step: 'Encrypt message',
      passed: !!encryptedData && !!iv
    });
    
    console.log('Encrypted: ', encryptedData.substring(0, 20) + '...');
    console.log('IV: ', iv);
    
    // Step 4: Decrypt the message
    console.log('Step 4: Decrypting message');
    const decryptedMessage = await GroupE2EE.decryptGroupMessage(encryptedData, iv, key);
    testResults.steps.push({
      step: 'Decrypt message',
      passed: decryptedMessage === testMessage
    });
    
    console.log('Decrypted: ', decryptedMessage);
    
    // Step 5: Rotate key
    console.log('Step 5: Rotating key');
    const { key: newKey, groupKey: newGroupKey } = await GroupE2EE.rotateGroupKey(
      groupId,
      creatorId,
      groupKey.version
    );
    testResults.steps.push({
      step: 'Rotate key',
      passed: newGroupKey.version === groupKey.version + 1
    });
    
    console.log('New key version:', newGroupKey.version);
    
    // Step 6: Generate a file key
    console.log('Step 6: Generating file key');
    const { key: fileKey, keyId: fileKeyId } = await GroupE2EE.generateGroupFileKey(groupId);
    testResults.steps.push({
      step: 'Generate file key',
      passed: !!fileKey && !!fileKeyId
    });
    
    console.log('File key ID:', fileKeyId);
    
    // Final report
    console.log('-----------------------------------');
    console.log('Group E2EE Test Results:');
    
    testResults.steps.forEach(step => {
      console.log(`- ${step.passed ? '✅' : '❌'} ${step.step}`);
    });
    
    const failedSteps = testResults.steps.filter(step => !step.passed);
    testResults.success = failedSteps.length === 0;
    
    console.log('-----------------------------------');
    console.log(`Overall: ${testResults.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log('-----------------------------------');
    
    return testResults;
    
  } catch (error) {
    console.error('Group E2EE test failed with error:', error);
    testResults.success = false;
    testResults.steps.push({
      step: 'Unexpected error',
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    });
    return testResults;
  }
}
