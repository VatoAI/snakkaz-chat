/**
 * SnakkaZ Ende-til-Ende-Kryptering (E2EE) Test
 * 
 * Denne filen inneholder tester for å verifisere at E2EE-funksjonaliteten
 * fungerer som forventet i ulike scenarioer.
 */

import { 
  encryptMessage, 
  decryptMessage, 
  generateGroupKey,
  exportGroupKey,
  importGroupKey,
  encryptGroupMessage,
  decryptGroupMessage,
  distributeGroupKey,
  runE2EETests
} from '../utils/crypto/e2ee';

/**
 * Enkel teststatus logger
 */
function logTestResult(testName: string, success: boolean, details: any = {}): void {
  const style = success 
    ? 'color: green; font-weight: bold;' 
    : 'color: red; font-weight: bold;';
  
  console.log(`%c[${success ? 'PASS' : 'FAIL'}] ${testName}`, style);
  
  if (details) {
    console.log(details);
  }
  
  console.log('-----------------------------------');
  
  // Call custom logger if available (for E2EETestPage integration)
  if (typeof window !== 'undefined' && (window as any).logTestResult) {
    (window as any).logTestResult(testName, success, details);
  }
}

/**
 * Kjør alle E2EE-tester
 */
export async function runAllE2EETests(): Promise<boolean> {
  console.log('%c====== STARTER E2EE-TESTER ======', 'color: blue; font-weight: bold;');
  let allTestsPassed = true;
  
  try {
    // Test 1: Peer-to-peer kryptering
    const user1 = 'test-user-1';
    const user2 = 'test-user-2';
    const testMessage = { 
      text: "Hei, dette er en testmelding!", 
      sender: user1, 
      timestamp: Date.now() 
    };
    
    // Krypter meldingen
    const encrypted = await encryptMessage(user1, user2, testMessage);
    
    // Dekrypter meldingen
    const decrypted = await decryptMessage(user2, user1, encrypted);
    
    // Sjekk at dekryptert melding matcher original
    const test1Success = 
      decrypted.text === testMessage.text && 
      decrypted.sender === testMessage.sender;
    
    logTestResult('Peer-to-peer kryptering/dekryptering', test1Success, {
      original: testMessage,
      encrypted: encrypted.substring(0, 50) + '...',
      decrypted
    });
    
    allTestsPassed = allTestsPassed && test1Success;
    
    // Test 2: Gruppekryptering
    const groupId = 'test-group-123';
    const groupMessage = {
      text: "Dette er en gruppemelding",
      sender: user1,
      groupId,
      timestamp: Date.now()
    };
    
    // Generer gruppenøkkel
    await generateGroupKey(groupId);
    const exportedKey = await exportGroupKey(groupId);
    
    // Krypter gruppemelding
    const groupEncrypted = await encryptGroupMessage(groupId, groupMessage);
    
    // Dekrypter gruppemelding
    const groupDecrypted = await decryptGroupMessage(groupId, groupEncrypted);
    
    // Sjekk at dekryptert gruppemelding matcher original
    const test2Success = 
      groupDecrypted.text === groupMessage.text && 
      groupDecrypted.sender === groupMessage.sender;
    
    logTestResult('Gruppekryptering/dekryptering', test2Success, {
      original: groupMessage,
      exportedKey: exportedKey.substring(0, 20) + '...',
      decrypted: groupDecrypted
    });
    
    allTestsPassed = allTestsPassed && test2Success;
    
    // Test 3: Importering av gruppenøkkel
    const importedKey = await importGroupKey(groupId, exportedKey);
    const decryptedWithImport = await decryptGroupMessage(
      groupId + '-import-test', 
      groupEncrypted, 
      exportedKey
    );
    
    const test3Success = 
      decryptedWithImport.text === groupMessage.text && 
      decryptedWithImport.sender === groupMessage.sender;
    
    logTestResult('Import av gruppenøkkel', test3Success, {
      importedKey: !!importedKey,
      decryptedWithImport
    });
    
    allTestsPassed = allTestsPassed && test3Success;
    
    // Test 4: Ytelsestest for flere meldinger
    const totalMessages = 10;
    const encryptTimes: number[] = [];
    const decryptTimes: number[] = [];
    
    for (let i = 0; i < totalMessages; i++) {
      const testMsg = { text: `Test melding ${i}`, index: i, timestamp: Date.now() };
      const startEncrypt = performance.now();
      const enc = await encryptMessage(user1, user2, testMsg);
      encryptTimes.push(performance.now() - startEncrypt);
      
      const startDecrypt = performance.now();
      await decryptMessage(user2, user1, enc);
      decryptTimes.push(performance.now() - startDecrypt);
    }
    
    const avgEncryptTime = encryptTimes.reduce((sum, time) => sum + time, 0) / totalMessages;
    const avgDecryptTime = decryptTimes.reduce((sum, time) => sum + time, 0) / totalMessages;
    
    logTestResult('Ytelsestest', true, {
      totalMessages,
      avgEncryptTime: `${avgEncryptTime.toFixed(2)} ms`,
      avgDecryptTime: `${avgDecryptTime.toFixed(2)} ms`,
      encryptTimes,
      decryptTimes
    });
    
    // Test 5: Kjør alle omfattende tester
    console.log('%c===== KJØRER OMFATTENDE TESTER =====', 'color: blue; font-weight: bold;');
    const comprehensiveTests = await runE2EETests();
    
    const test5Success = 
      comprehensiveTests.peerToPeerTest.success && 
      comprehensiveTests.groupTest.success;
    
    logTestResult('Omfattende tester', test5Success, comprehensiveTests);
    
    allTestsPassed = allTestsPassed && test5Success;
    
    // Test 6: Test distribuering av gruppenøkkel
    const mockEncryptFn = async (memberId: string, data: any) => {
      console.log(`Simulerer sending av nøkkel til: ${memberId}`, data.type);
      return memberId !== 'failing-user'; // Simulerer feil for en bestemt bruker
    };
    
    const distributionResult = await distributeGroupKey(
      groupId,
      user1,
      [user2, 'test-user-3', 'test-user-4', 'failing-user'],
      mockEncryptFn
    );
    
    logTestResult('Nøkkeldistribusjon', distributionResult.success, {
      distributionResult,
      successfulMembers: 3,
      failedMembers: 1
    });
    
    allTestsPassed = allTestsPassed && distributionResult.success;
    
  } catch (error) {
    console.error('Testfeil:', error);
    allTestsPassed = false;
  }
  
  console.log(`%c====== E2EE-TESTER ${allTestsPassed ? 'BESTÅTT' : 'FEILET'} ======`, 
    allTestsPassed ? 'color: green; font-weight: bold;' : 'color: red; font-weight: bold;');
  
  return allTestsPassed;
}

// Kjør automatisk når importert direkte
if (typeof window !== 'undefined' && window.document && window.document.location.href.includes('test-e2ee')) {
  runAllE2EETests().then(success => {
    console.log(`E2EE-tester fullført med ${success ? 'suksess!' : 'feil!'}`);
  });
}
