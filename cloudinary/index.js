// |--------------| Required Libraries |----------------| //
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// |--------------| Required Libraries |----------------| //

// |---------------| Cloudinary Config |----------------| //
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
// |---------------| Cloudinary Config |----------------| //

// === Cloudinary Storage instance === //
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp', // Folder where the Cloudinary Images URLs are going to storage
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

// === Cloudinary export === //
module.exports = {
    cloudinary,
    storage
};