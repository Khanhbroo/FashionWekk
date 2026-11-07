const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dptpb60p7',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MANIFEST_PATH = path.join(__dirname, '..', 'data', 'cloudinary_catalog.json');

// Read existing catalog manifest safely
function readManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

// Convert standard upload URL to optimized format with automatic WebP and AVIF
function formatOptimizedUrl(url) {
  if (!url) return '';
  if (url.includes('/image/upload/f_auto,q_auto/')) return url;
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

// Upload a single file with full optimization
async function uploadAsset(filePath, publicId) {
  if (!fs.existsSync(filePath)) {
    throw new Error('File does not exist: ' + filePath);
  }

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image'
  });

  return formatOptimizedUrl(result.secure_url);
}

// Batch upload handler for multiple assets
async function syncBatch(items) {
  const manifest = readManifest();

  for (const item of items) {
    console.log('Uploading asset:', item.publicId);
    const url = await uploadAsset(item.filePath, item.publicId);
    manifest[item.id || item.publicId] = url;
    console.log('Uploaded successfully to:', url);
  }

  const dir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Updated manifest with', Object.keys(manifest).length, 'total assets.');
  return manifest;
}

// Pull all existing resources from Cloudinary folder prefix
async function refreshFromCloudinary() {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'fashionwekk',
    max_results: 500
  });

  const catalog = readManifest();
  result.resources.forEach(r => {
    catalog[r.public_id] = formatOptimizedUrl(r.secure_url);
  });

  const dir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  console.log('Refreshed catalog from Cloudinary with', Object.keys(catalog).length, 'assets.');
  return catalog;
}

if (require.main === module) {
  if (process.argv.includes('--refresh')) {
    refreshFromCloudinary().catch(console.error);
  }
}

module.exports = { syncBatch, uploadAsset, readManifest, refreshFromCloudinary, formatOptimizedUrl };
