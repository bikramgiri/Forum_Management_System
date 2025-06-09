const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {  // cb == callback
        cb(null, './storage') // cb(error, succsess)
    },
      filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname) // cb(error, filename)
      }
})

module.exports = {
      multer,
      storage
}

// **OR
// module.exports = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5 MB
//     },
//     fileFilter: function(req, file, cb) {
//         const fileTypes = /jpeg|jpg|png|gif/;
//         const mimetype = fileTypes.test(file.mimetype);
//         const extname = fileTypes.test(file.originalname.split('.').pop().toLowerCase());

//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb('Error: File upload only supports the following filetypes - ' + fileTypes);
//         }
//     }
// });


