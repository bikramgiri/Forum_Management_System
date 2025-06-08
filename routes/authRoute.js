const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage } = require("../controller/authController")

const router = require("express").Router()

router.route("/").get(renderHomePage)
router.route("/register").post(handleRegister).get(renderRegisterPage)
router.route("/login").post(handleLogin).get(renderLoginPage)


module.exports = router