const { renderAskQuestionPage, handleAskQuestion } = require("../controller/questionController")
const { isAuthenticated } = require("../Middleware/isAuthenticated")

const router = require("express").Router()

const {multer,storage} = require('../Middleware/multerConfig') // Import multer and storage configuration
const upload = multer({ storage: storage }) // Create a multer instance with the storage configuration

router.route("/askquestion").post(isAuthenticated, upload.single('image'), handleAskQuestion).get(isAuthenticated, renderAskQuestionPage)

module.exports = router