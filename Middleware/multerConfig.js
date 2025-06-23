const multer = require('multer')


// **For Multer Storage
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {  // cb == callback
//         cb(null, './storage') // cb(error, succsess)
//     },
//       filename: function(req, file, cb) {
//             cb(null, Date.now() + '-' + file.originalname) // cb(error, filename)
//       }
// })

// module.exports = {
//       multer,
//       storage
// }



// **For Cloudinary Storage
// const cloudinary = require('cloudinary')

const storage = multer.diskStorage({
      filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname) // cb(error, filename)
      }
})

module.exports = {
      multer,
      storage
}


