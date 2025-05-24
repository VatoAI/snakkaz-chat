#!/usr/bin/env node

/**
 * Snakkaz Chat Deployment Verification Script
 * This script checks if the deployment was successful by
 * verifying that key resources are available on the production site.
 */

import fetch from 'node-fetch';
import chalk from 'chalk';

const SITE_URL = 'https://www.snakkaz.com';
const RESOURCES = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
];

async function checkResource(url) {
  try {
    const response = await fetch(url);
    const status = response.status;
    const contentType = response.headers.get('content-type');
    
    return {
      url,
      status,
      contentType,
      success: status >= 200 && status < 300
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      success: false
    };
  }
}

async function verifyDeployment() {
  console.log(chalk.blue('🔍 Verifying Snakkaz Chat deployment...\n'));
  
  console.log(chalk.yellow('Checking resources at', SITE_URL));
  
  let allSuccess = true;
  
  for (const resource of RESOURCES) {
    const url = `${SITE_URL}${resource}`;
    const result = await checkResource(url);
    
    if (result.success) {
      console.log(
        chalk.green('✅'),
        resource.padEnd(20),
        chalk.green(`[${result.status}]`),
        result.contentType || ''
      );
    } else {
      allSuccess = false;
      console.log(
        chalk.red('❌'),
        resource.padEnd(20),
        chalk.red(`[${result.status || 'ERROR'}]`),
        result.error || ''
      );
    }
  }
  
  // Check that clean-up was successful
  const extractScript = await checkResource(`${SITE_URL}/extract.php`);
  if (extractScript.success) {
    console.log(
      chalk.yellow('⚠️'),
      '/extract.php'.padEnd(20),
      chalk.yellow('[Warning]'),
      'Extraction script still exists, should be removed for security'
    );
    allSuccess = false;
  } else {
    console.log(
      chalk.green('✅'),
      '/extract.php'.padEnd(20),
      'Script not found (good for security)'
    );
  }
  
  const zipFile = await checkResource(`${SITE_URL}/snakkaz-dist.zip`);
  if (zipFile.success) {
    console.log(
      chalk.yellow('⚠️'),
      '/snakkaz-dist.zip'.padEnd(20),
      chalk.yellow('[Warning]'),
      'ZIP file still exists, should be removed for security'
    );
    allSuccess = false;
  } else {
    console.log(
      chalk.green('✅'),
      '/snakkaz-dist.zip'.padEnd(20),
      'ZIP not found (good for security)'
    );
  }
  
  console.log('\n');
  
  if (allSuccess) {
    console.log(chalk.green('✅ All checks passed! Deployment appears to be successful.'));
  } else {
    console.log(chalk.yellow('⚠️ Some checks failed. Review the results above.'));
  }
  
  console.log('\n');
  console.log(chalk.blue('Next steps:'));
  console.log('1. Manually verify the application functionality');
  console.log('2. Complete the testing checklist in GROUP-SETTINGS-TESTING-CHECKLIST.md');
  console.log('3. Monitor error logs for any unexpected issues');
  
  return allSuccess;
}

verifyDeployment().catch(error => {
  console.error(chalk.red('Error running verification:'), error);
  process.exit(1);
});
