#!/usr/bin/env node
/**
 * SNAKKAZ LIVE DEPLOYMENT MONITOR - June 7, 2025
 * Monitors www.snakkaz.com for new bundle deployment
 */

import https from 'https';

async function checkDeploymentStatus() {
  console.log('🔍 MONITORING: Checking www.snakkaz.com deployment status...\n');
  
  try {
    const response = await new Promise((resolve, reject) => {
      https.get('https://www.snakkaz.com', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
    
    // Check for old vs new bundle
    const hasOldBundle = response.includes('index-DqQAMTdx.js');
    const hasNewBundle = response.includes('index-CEa86-6h.js');
    const hasEmergencyScript = response.includes('/emergency-react-fix.js');
    
    console.log('📊 DEPLOYMENT STATUS:');
    console.log('====================');
    console.log(`🔴 Old Bundle (DqQAMTdx): ${hasOldBundle ? 'STILL PRESENT' : 'REMOVED'}`);
    console.log(`🟢 New Bundle (CEa86-6h): ${hasNewBundle ? 'DEPLOYED ✅' : 'NOT DEPLOYED ❌'}`);
    console.log(`🚨 Emergency Script: ${hasEmergencyScript ? 'PRESENT ✅' : 'MISSING ❌'}`);
    
    if (hasNewBundle && hasEmergencyScript && !hasOldBundle) {
      console.log('\n🎉 DEPLOYMENT SUCCESSFUL! Site is updated with emergency fixes!');
      return true;
    } else if (hasNewBundle && hasEmergencyScript) {
      console.log('\n⚠️ PARTIAL SUCCESS: New bundle deployed but old bundle still present');
      return false;
    } else {
      console.log('\n❌ DEPLOYMENT PENDING: New bundle not yet live');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error checking deployment:', error.message);
    return false;
  }
}

async function checkEmergencyScript() {
  console.log('\n🚨 Testing emergency script accessibility...');
  
  try {
    const response = await new Promise((resolve, reject) => {
      https.get('https://www.snakkaz.com/emergency-react-fix.js', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ data, status: res.statusCode }));
      }).on('error', reject);
    });
    
    if (response.status === 200 && response.data.includes('createEmergencyUseState')) {
      console.log('✅ Emergency script is accessible and contains React fixes');
      return true;
    } else {
      console.log(`❌ Emergency script not accessible (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error accessing emergency script:', error.message);
    return false;
  }
}

async function main() {
  const deploymentOk = await checkDeploymentStatus();
  const scriptOk = await checkEmergencyScript();
  
  console.log('\n📋 SUMMARY:');
  console.log('============');
  console.log(`Bundle Deployment: ${deploymentOk ? '✅ SUCCESS' : '❌ PENDING'}`);
  console.log(`Emergency Script: ${scriptOk ? '✅ WORKING' : '❌ NOT ACCESSIBLE'}`);
  
  if (deploymentOk && scriptOk) {
    console.log('\n🚀 SNAKKAZ IS READY FOR NORWEGIAN TECH COMMUNITY! 🇳🇴');
    console.log('Next steps: Monitor performance and engage community');
  } else {
    console.log('\n⏳ Deployment still in progress. Re-run this script in 2-3 minutes.');
  }
}

main().catch(console.error);
