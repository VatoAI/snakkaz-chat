// Image Optimization Script
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const IMAGE_DIRS = ['src/assets', 'public/images', 'src/components/images'];
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const SIZES = [1920, 1280, 768, 480];

async function generateResponsiveImages() {
  console.log('Generating responsive images...');
  
  // Process each directory
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} doesn't exist, skipping`);
      continue;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      
      // Only process image files
      if (!EXTENSIONS.includes(ext)) continue;
      
      // Create a responsive directory
      const baseName = path.basename(file, ext);
      const responsiveDir = path.join(dir, 'responsive', baseName);
      
      if (!fs.existsSync(responsiveDir)) {
        fs.mkdirSync(responsiveDir, { recursive: true });
      }
      
      // Generate responsive versions
      for (const width of SIZES) {
        try {
          await sharp(filePath)
            .resize(width)
            .toFile(path.join(responsiveDir, `${baseName}-${width}${ext}`));
          
          // Also generate WebP version
          await sharp(filePath)
            .resize(width)
            .webp({ quality: 80 })
            .toFile(path.join(responsiveDir, `${baseName}-${width}.webp`));
        } catch (err) {
          console.error(`Error processing ${filePath} at width ${width}:`, err);
        }
      }
      
      console.log(`Generated responsive versions for ${file}`);
    }
  }
  
  console.log('Responsive image generation complete');
}

async function optimizeImages() {
  console.log('Optimizing images...');
  
  // Process each directory
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} doesn't exist, skipping`);
      continue;
    }
    
    // Optimize all images in directory
    try {
      await imagemin([`${dir}/*.{jpg,png,jpeg}`], {
        destination: `${dir}/optimized`,
        plugins: [
          imageminWebp({ quality: 80 })
        ]
      });
      
      console.log(`Optimized images in ${dir}`);
    } catch (err) {
      console.error(`Error optimizing images in ${dir}:`, err);
    }
  }
  
  console.log('Image optimization complete');
}

// Run the functions
async function main() {
  try {
    await optimizeImages();
    await generateResponsiveImages();
  } catch (err) {
    console.error('Error during image processing:', err);
  }
}

main();
