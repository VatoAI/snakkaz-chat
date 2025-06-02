#!/usr/bin/env node
/**
 * Advanced Image Optimization Script for Snakkaz Chat
 * STEG 5: Performance Optimization
 * 
 * This script optimizes all images in the project for better performance
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  inputDirs: [
    'src/assets',
    'public/images', 
    'public/icons',
    'src/components/images'
  ],
  outputDir: 'public/optimized',
  formats: ['webp', 'avif'], // Modern formats for better compression
  quality: {
    webp: 80,
    avif: 70,
    jpeg: 85,
    png: 90
  },
  sizes: [320, 640, 1024, 1920], // Responsive breakpoints
  skipExisting: true
};

// Stats tracking
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  sizeSaved: 0,
  startTime: Date.now()
};

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath, outputDir, baseName) {
  const originalSize = getFileSize(inputPath);
  let totalSaved = 0;
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create Sharp instance
    const sharpInstance = sharp(inputPath);
    const metadata = await sharpInstance.metadata();
    
    console.log(`🔄 Processing: ${baseName} (${metadata.width}x${metadata.height})`);
    
    // Generate optimized versions for each format
    for (const format of CONFIG.formats) {
      // Original size optimization
      const originalOutput = path.join(outputDir, `${baseName}.${format}`);
      
      if (CONFIG.skipExisting && fs.existsSync(originalOutput)) {
        console.log(`⏭️  Skipping existing: ${baseName}.${format}`);
        stats.skipped++;
        continue;
      }
      
      await sharpInstance
        .clone()
        [format]({ quality: CONFIG.quality[format] })
        .toFile(originalOutput);
        
      const optimizedSize = getFileSize(originalOutput);
      totalSaved += originalSize - optimizedSize;
      
      console.log(`✅ Created: ${baseName}.${format} (${formatBytes(optimizedSize)})`);
      
      // Generate responsive sizes
      for (const size of CONFIG.sizes) {
        if (size >= metadata.width) continue; // Don't upscale
        
        const responsiveOutput = path.join(outputDir, `${baseName}-${size}w.${format}`);
        
        if (CONFIG.skipExisting && fs.existsSync(responsiveOutput)) {
          continue;
        }
        
        await sharpInstance
          .clone()
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          [format]({ quality: CONFIG.quality[format] })
          .toFile(responsiveOutput);
          
        console.log(`📱 Created responsive: ${baseName}-${size}w.${format}`);
      }
    }
    
    stats.processed++;
    stats.sizeSaved += totalSaved;
    
    console.log(`💾 Saved: ${formatBytes(totalSaved)} for ${baseName}\n`);
    
  } catch (error) {
    console.error(`❌ Error processing ${baseName}:`, error.message);
    stats.errors++;
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(inputDir, outputDir) {
  const resolvedInputDir = path.resolve(inputDir);
  
  if (!fs.existsSync(resolvedInputDir)) {
    console.log(`⚠️  Directory not found: ${inputDir}`);
    return;
  }
  
  const files = fs.readdirSync(resolvedInputDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext);
  });
  
  if (imageFiles.length === 0) {
    console.log(`📁 No images found in: ${inputDir}`);
    return;
  }
  
  console.log(`📁 Processing ${imageFiles.length} images from: ${inputDir}`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(resolvedInputDir, file);
    const baseName = path.basename(file, path.extname(file));
    
    await optimizeImage(inputPath, outputDir, baseName);
  }
}

/**
 * Generate optimization report
 */
function generateReport() {
  const duration = (Date.now() - stats.startTime) / 1000;
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 IMAGE OPTIMIZATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`📊 Images processed: ${stats.processed}`);
  console.log(`⏭️  Images skipped: ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`💾 Total size saved: ${formatBytes(stats.sizeSaved)}`);
  console.log(`⏱️  Duration: ${duration.toFixed(2)}s`);
  console.log('='.repeat(60));
  
  if (stats.sizeSaved > 0) {
    console.log('📈 Performance Impact:');
    console.log(`   • Reduced bundle size by ${formatBytes(stats.sizeSaved)}`);
    console.log(`   • Improved page load times`);
    console.log(`   • Better mobile performance`);
    console.log(`   • Reduced bandwidth usage`);
  }
  
  console.log('\n🎉 Image optimization complete!');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Advanced Image Optimization');
  console.log('📦 STEG 5: Performance Optimization\n');
  
  // Ensure output directory exists
  const outputDir = path.resolve(CONFIG.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Process each input directory
  for (const inputDir of CONFIG.inputDirs) {
    await processDirectory(inputDir, outputDir);
  }
  
  // Generate optimization report
  generateReport();
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Optimization failed:', error);
    process.exit(1);
  });
}

export { main as optimizeImages };
