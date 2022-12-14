require('dotenv').config();
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
// comfiguring cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
// console.log(process.env.API_SECRET)
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormarts: ['jpeg', 'png', 'jpg'],
    params: {
        folder: 'blog-app-images',
        transformation: [{
            width: 500, height: 500
        }]
    }
})

module.exports = storage