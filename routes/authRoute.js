const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage, handleLogout } = require("../controller/authController")

const router = require("express").Router()

router.route("/").get(renderHomePage)
router.route("/register").post(handleRegister).get(renderRegisterPage)
router.route("/login").post(handleLogin).get(renderLoginPage)
router.route("/logout").get(handleLogout)


module.exports = router