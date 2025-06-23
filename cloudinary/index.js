require('dotenv').config()
const cloudinary = require('cloudinary')
// const {CloudinaryStorage} = require('multer-storage-cloudinary')

// configuration
cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
})

// const storage = new CloudinaryStorage({
//       cloudinary: cloudinary,
//       params: {
//             folder: 'fms', // Folder in Cloudinary where images will be stored
//             allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
//             transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional transformations
//       }
// })
// console.log(storage)

module.exports = {cloudinary}


