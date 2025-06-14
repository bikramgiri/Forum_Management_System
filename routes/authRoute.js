const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage, handleLogout, renderForgotPasswordPage, handleForgotPassword, renderVerifyOtpPage, handleVerifyOtp } = require("../controller/authController")

const router = require("express").Router()

router.route("/").get(renderHomePage)
router.route("/register").post(handleRegister).get(renderRegisterPage)
router.route("/login").post(handleLogin).get(renderLoginPage)
router.route("/logout").get(handleLogout)
router.route("/forgotPassword").get(renderForgotPasswordPage).post(handleForgotPassword)
router.route("/verifyOtp").get(renderVerifyOtpPage).post(handleVerifyOtp)

module.exports = router