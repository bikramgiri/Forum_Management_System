const { renderAskQuestionPage, handleAskQuestion, renderSingleQuestionPage } = require("../controller/questionController")
const { isAuthenticated } = require("../Middleware/isAuthenticated")

const router = require("express").Router()
const catchError = require("../utils/catchError")

// **For Multer Storage Configuration                               
// const {multer,storage} = require('../Middleware/multerConfig') // Import multer and storage configuration
// const upload = multer({ storage: storage }) // Create a multer instance with the storage configuration


// **For Cloudinary Configuration
//// const multer = require('multer') 
////const { storage } = require('../cloudinary/index') // Import Cloudinary configuration
const {multer,storage} = require('../Middleware/multerConfig') 
const upload = multer({ storage: storage }) // Create a multer instance with the Cloudinary storage configuration



router.route("/askquestion").post(isAuthenticated, upload.single('image'), catchError(handleAskQuestion)).get(isAuthenticated, catchError(renderAskQuestionPage))
router.route("/question/:id").get(catchError(renderSingleQuestionPage))

module.exports = router