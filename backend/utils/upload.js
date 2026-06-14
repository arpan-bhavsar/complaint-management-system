const cloudinary = require('cloudinary').v2;
const multerStorageCloudinary = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;

// Configure Cloudinary with your secret credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up the storage engine
const storage = new CloudinaryStorage({
  // THE FIX: Pass the root cloudinary package here instead of the v2 shortcut
  cloudinary: require('cloudinary'), 
  params: {
    folder: 'complaint_system', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

// Initialize Multer with our Cloudinary storage settings
const upload = multer({ storage: storage });

module.exports = upload;