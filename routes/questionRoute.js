const { renderAskQuestionPage, handleAskQuestion, renderSingleQuestionPage, renderEditQuestionPage, handleEditQuestion, deleteQuestion } = require("../controller/questionController")
const { isAuthenticated } = require("../Middleware/isAuthenticated")

const router = require("express").Router()
const sanitizer = require("../utils/sanitizer")
const catchError = require("../utils/catchError")

// **For Multer Storage Configuration                               
// const {multer,storage} = require('../Middleware/multerConfig') // Import multer and storage configuration
// const upload = multer({ storage: storage }) // Create a multer instance with the storage configuration


// **For Cloudinary Configuration
//// const multer = require('multer') 
////const { storage } = require('../cloudinary/index') // Import Cloudinary configuration
const {multer,storage} = require('../Middleware/multerConfig') 
const upload = multer({ storage: storage }) // Create a multer instance with the Cloudinary storage configuration



router.route("/askquestion").post(isAuthenticated, upload.single('image'), sanitizer, catchError(handleAskQuestion)).get(isAuthenticated, catchError(renderAskQuestionPage))
router.route("/question/:id").get(catchError(renderSingleQuestionPage))
router.route("/question/edit/:id").get(isAuthenticated, catchError(renderEditQuestionPage)).post(isAuthenticated, upload.single('image'), sanitizer, catchError(handleEditQuestion));
router.route("/question/delete/:id").delete(isAuthenticated, catchError(deleteQuestion));

module.exports = router