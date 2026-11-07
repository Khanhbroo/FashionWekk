const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dptpb60p7',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const imagesDir = path.join(__dirname, '../../public/assets/images');

async function uploadMasterpieces() {
  console.log('Reading local images from:', imagesDir);
  const files = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  console.log(`Found ${files.length} images to upload...`);

  const results = {};

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const publicId = path.parse(file).name;
    console.log(`Uploading ${file} to Cloudinary...`);
    try {
      const uploadRes = await cloudinary.uploader.upload(filePath, {
        folder: 'fashionwekk/masterpieces',
        public_id: publicId,
        overwrite: true,
      });
      // Build auto-optimized CDN URL
      const optimizedUrl = uploadRes.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
      results[publicId] = optimizedUrl;
      console.log(`Uploaded ${publicId}: ${optimizedUrl}`);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err.message);
    }
  }

  const outputPath = path.join(__dirname, 'uploaded_masterpieces.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log('Saved masterpiece URLs to:', outputPath);
}

uploadMasterpieces().catch(console.error);
