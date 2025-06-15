const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage, handleLogout, renderForgotPasswordPage, handleForgotPassword, renderVerifyOtpPage, handleVerifyOtp, renderResetPasswordPage, handleResetPassword } = require("../controller/authController")

const router = require("express").Router()

router.route("/").get(renderHomePage)
router.route("/register").post(handleRegister).get(renderRegisterPage)
router.route("/login").post(handleLogin).get(renderLoginPage)
router.route("/logout").get(handleLogout)
router.route("/forgotPassword").get(renderForgotPasswordPage).post(handleForgotPassword)
router.route("/verifyOtp").get(renderVerifyOtpPage)
router.route("/verifyOtp/:id").post(handleVerifyOtp)
router.route("/resetPassword").get(renderResetPasswordPage)
router.route("/resetPassword/:email/:otp").post(handleResetPassword)
// **OR
// router.route("/resetPassword/:id1/:id2").post(handleResetPassword)

module.exports = router