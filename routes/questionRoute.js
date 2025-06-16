const { renderAskQuestionPage, handleAskQuestion, renderSingleQuestionPage } = require("../controller/questionController")
const { isAuthenticated } = require("../Middleware/isAuthenticated")

const router = require("express").Router()

const {multer,storage} = require('../Middleware/multerConfig') // Import multer and storage configuration
const catchError = require("../utils/catchError")
const upload = multer({ storage: storage }) // Create a multer instance with the storage configuration

router.route("/askquestion").post(isAuthenticated, upload.single('image'), catchError(handleAskQuestion)).get(isAuthenticated, catchError(renderAskQuestionPage))
router.route("/question/:id").get(catchError(renderSingleQuestionPage))

module.exports = router