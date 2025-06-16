const { handleRegister, renderRegisterPage, handleLogin, renderLoginPage, renderHomePage, handleLogout, renderForgotPasswordPage, handleForgotPassword, renderVerifyOtpPage, handleVerifyOtp, renderResetPasswordPage, handleResetPassword } = require("../controller/authController")
const catchError = require("../utils/catchError")

const router = require("express").Router()

router.route("/").get(catchError(renderHomePage))
router.route("/register").post(catchError(handleRegister)).get(catchError(renderRegisterPage))
router.route("/login").post(catchError(handleLogin)).get(catchError(renderLoginPage))
router.route("/logout").get(catchError(handleLogout))
router.route("/forgotPassword").get(catchError(renderForgotPasswordPage)).post(catchError(handleForgotPassword))
router.route("/verifyOtp").get(catchError(renderVerifyOtpPage))
router.route("/verifyOtp/:id").post(catchError(handleVerifyOtp))
router.route("/resetPassword").get(catchError(renderResetPasswordPage))
router.route("/resetPassword/:email/:otp").post(catchError(handleResetPassword))
// **OR
// router.route("/resetPassword/:id1/:id2").post(handleResetPassword)

module.exports = router