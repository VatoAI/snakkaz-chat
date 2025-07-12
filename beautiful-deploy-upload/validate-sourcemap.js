#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function validateSourceMap(jsFile, mapFile) {
  console.log('🔍 Validating source map...\n');
  
  // Check if files exist
  if (!fs.existsSync(jsFile)) {
    console.error('❌ JavaScript file not found:', jsFile);
    return false;
  }
  
  if (!fs.existsSync(mapFile)) {
    console.error('❌ Source map file not found:', mapFile);
    return false;
  }
  
  console.log('✅ Both files exist');
  console.log(`   JS file: ${path.basename(jsFile)} (${fs.statSync(jsFile).size} bytes)`);
  console.log(`   Map file: ${path.basename(mapFile)} (${fs.statSync(mapFile).size} bytes)\n`);
  
  // Check if JS file references the source map
  const jsContent = fs.readFileSync(jsFile, 'utf8');
  const sourceMappingRegex = /\/\/# sourceMappingURL=(.+)$/m;
  const sourceMappingMatch = jsContent.match(sourceMappingRegex);
  
  if (!sourceMappingMatch) {
    console.error('❌ No source map reference found in JavaScript file');
    return false;
  }
  
  const referencedMapFile = sourceMappingMatch[1];
  console.log('✅ Source map reference found:', referencedMapFile);
  
  if (referencedMapFile !== path.basename(mapFile)) {
    console.error('❌ Source map reference mismatch');
    console.error(`   Expected: ${path.basename(mapFile)}`);
    console.error(`   Found: ${referencedMapFile}`);
    return false;
  }
  
  // Parse and validate source map JSON
  let sourceMap;
  try {
    const mapContent = fs.readFileSync(mapFile, 'utf8');
    sourceMap = JSON.parse(mapContent);
    console.log('✅ Source map is valid JSON\n');
  } catch (error) {
    console.error('❌ Invalid source map JSON:', error.message);
    return false;
  }
  
  // Validate source map structure
  const requiredFields = ['version', 'sources', 'mappings', 'file'];
  const missingFields = requiredFields.filter(field => !sourceMap[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing required fields:', missingFields.join(', '));
    return false;
  }
  
  console.log('📊 Source Map Analysis:');
  console.log(`   Version: ${sourceMap.version}`);
  console.log(`   Target file: ${sourceMap.file}`);
  console.log(`   Source files: ${sourceMap.sources.length}`);
  console.log(`   Names count: ${sourceMap.names ? sourceMap.names.length : 'N/A'}`);
  console.log(`   Mappings length: ${sourceMap.mappings.length} characters`);
  
  // Validate target file reference
  if (sourceMap.file !== path.basename(jsFile)) {
    console.warn('⚠️  Source map file reference mismatch');
    console.warn(`   Expected: ${path.basename(jsFile)}`);
    console.warn(`   Found: ${sourceMap.file}`);
  }
  
  // Check if source files exist (sample check)
  console.log('\n🔍 Checking source file references...');
  const existingSourcesCount = sourceMap.sources.filter(source => {
    const fullPath = path.resolve(path.dirname(mapFile), source);
    return fs.existsSync(fullPath);
  }).length;
  
  console.log(`   ${existingSourcesCount}/${sourceMap.sources.length} source files found`);
  
  // Show first few source files
  console.log('\n📁 First 10 source files:');
  sourceMap.sources.slice(0, 10).forEach((source, index) => {
    console.log(`   ${index + 1}. ${source}`);
  });
  
  if (sourceMap.sources.length > 10) {
    console.log(`   ... and ${sourceMap.sources.length - 10} more`);
  }
  
  console.log('\n✅ Source map appears to be valid!');
  return true;
}

// Run validation
const jsFile = process.argv[2] || 'dist/assets/js/vendor-misc-NzPPuGIa.js';
const mapFile = process.argv[3] || 'dist/assets/js/vendor-misc-NzPPuGIa.js.map';

validateSourceMap(jsFile, mapFile);
