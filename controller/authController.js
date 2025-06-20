require('dotenv').config()
const { users, questions } = require("../model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')


// const renderHomePage = (req, res) => {
//     res.render('home')
// }

// module.exports = renderHomePage;
// **OR
exports.renderHomePage = async(req, res) => {
    const [success] = req.flash('success') // Get success message from flash
    const data = await questions.findAll(
        {
            include: [{
                model: users,
                attributes: ['username', 'email'] // Include only specific fields from the users table
            }],
            order: [['createdAt', 'DESC']] // Order by createdAt in descending order
        }
    )
    res.render('home', {data: data, success: success}) // Pass the data to the home page
}

exports.renderRegisterPage = (req, res) => {
    const [error] = req.flash('error') // Get error message from flash
    res.render('auth/register', { error: error })
}

exports.handleRegister =  async (req, res) => {
        const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).send('Please provide username, email, and password')
    }

    // **Check if the user already exists
    // const existingUser = await users.findOne({ where: { email: email } })
    // if (existingUser) {
    //     return res.status(400).send('User already exists')
    // }
    // **OR
    const data = await users.findAll({
        where: {
            email: email
        }
    })
    if (data.length > 0) {
        // return res.status(400).send('User already exists')
        req.flash('error', 'User already exists') // Use flash message to show error
        return res.redirect('/register') // Redirect to register page if user already exists
    }

    await sendEmail({
        email: email,
        text: "Thank you for Regestering!",
        subject: "Welcome To DisForum!"
    })

    // **Create a new user
    await users.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 10) // Hashing the password
    })
    res.redirect('/login')
}

exports.renderLoginPage = (req, res) => {
    const [error] = req.flash('error')
    const [success] = req.flash('success') // Get success message from flash
    res.render('auth/login', { error: error, success: success }) // Pass the error and success messages to the login page
}

exports.handleLogin =  async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send('Please provide email and password')
    }
    
    // **First Method
    // **Check if the user exists
    // const user = await users.findOne({ where: { email: email } })
    // if (!user) {
    //     return res.status(400).send('Invalid email')
    // }
    // **OR
    
    // **Check if the user exists
    const data = await users.findAll({
        where: {
            email: email
        }
    })
    
    // send email to user login successfully
    await sendEmail({
        email: email,
        text: "Thank you for Logging In!",
        subject: "Welcome Back To DisForum!"
    })


    if (data.length === 0) { // If no user found with the given email
        // return res.status(400).send('Invalid email')
        req.flash('error', 'No user found with this email') // Use flash message to show error
        res.redirect('/login') // Redirect to login page if email is invalid
    }else {
        // **Check if the password is valid
        const isPasswordValid = bcrypt.compareSync(password, data[0].password) // data[0] because findAll returns an array
        if (!isPasswordValid) {
            // return res.status(400).send('Invalid password')
            req.flash('error', 'Invalid password') // Use flash message to show error
            res.redirect('/login') // Redirect to login page if password is invalid
        }else {
            // **Generate JWT token
            const token = jwt.sign({ id: data[0].id, email: data[0].email }, process.env.JWT_SECRETKEY, { expiresIn: '1d' }) // Sign the token with a secret key and set expiration time
            // **Set the token in the response header
            res.cookie('jwtToken', token, { 
                httpOnly: false,  // Prevent client-side JavaScript from accessing the cookie
                // secure: true, // Use secure flag to ensure the cookie is sent over HTTPS only
                sameSite: 'Strict', // Prevent the browser from sending this cookie along with cross-site requests
                maxAge: 1000 * 60 * 60 * 48 // 2 days
            }) // Set cookie with httpOnly flag
            req.flash('success', 'Login successful') // Use flash message to show success
            res.redirect('/')
        }
    } 

    
    // **Second Method
    // // **Check if the user exists
    // // const user = await users.findOne({ where: { email: email } })
    // // if (!user) {
    // //     return res.status(400).send('Invalid email')
    // // }
    // // **OR
    // const data = await users.findAll({
    //     where: {
    //         email: email
    //     }
    // })
    // if (data.length === 0) {
    //     return res.status(400).send('Invalid email')
    // }
    // // **Check if the password is valid
    // const isPasswordValid = bcrypt.compareSync(password, data.password)
    // if (!isPasswordValid) {
    //     return res.status(400).send('Invalid password')
    // }

    // res.redirect('/')
}


exports.handleLogout = (req, res) => {
    // **Clear the JWT token cookie
    res.clearCookie('jwtToken')
    req.flash('success', 'Logout successful') // Use flash message to show success
    res.redirect('/login') // Redirect to the login page after logout
}

exports.renderForgotPasswordPage = (req, res) => {
    res.render('./auth/forgotPassword')
}

exports.handleForgotPassword = async (req, res) => {
    const {email} = req.body
    const otp = Math.floor(100000 + Math.random() * 900000) // Generate a random 6-digit OTP
    if (!email) {
        return res.status(400).send('Please provide an email')
    }
    // **Check if the user exists
    const data = await users.findAll({
        where: {
            email: email
        }
    })
    if (data.length === 0) {
        return res.status(400).send('User not found')
    }
    // **Send OTP to the above incoming email
    sendEmail({
        email : email,
        subject : "Your OTP for reset password",
        text : `Your OTP is ${otp}`
    })
    data[0].otp = otp
    data[0].otpGeneratedTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() // Store the current date and time as a string, example: "10/10/2023 10:10:10 AM"
    // **Save the OTP and OTP generated time to the user
    await data[0].save()

    res.redirect("/verifyOtp?email=" + email) // Redirect to the verify OTP page with the email as a query parameter
}

exports.renderVerifyOtpPage = (req, res) => {
    const email = req.query.email
    res.render("./auth/verifyOtp", { email: email })
}

exports.handleVerifyOtp = async (req, res) => {
    const {otp} = req.body
    const email = req.params.id
    // **Check if the user exists
    const data = await users.findAll({
        where: {
            email: email,
            otp: otp
        }
    })
    if (data.length === 0) {
        return res.status(400).send('Invalid OTP')
    }
    // **Check if the OTP is expired 
    const otpGeneratedTime = new Date(data[0].otpGeneratedTime) // Convert the stored string to a Date object
    const currentTime = new Date() // Get the current date and time
    const timeDiff = currentTime - otpGeneratedTime
    const otpExpiryTime = 2 * 60 * 1000 // 2 minutes in milliseconds
    if (timeDiff > otpExpiryTime) {
        return res.status(400).send('OTP has expired')
    }
    res.redirect(`/resetPassword?email=${email}&otp=${otp}`) // Redirect to the reset password page with the email and OTP as query parameters
}

exports.renderResetPasswordPage = (req, res) => {
    const {email, otp} = req.query
    if (!email || !otp) {
        return res.status(400).send('Invalid request, email and OTP are required')
    }
    res.render("./auth/resetPassword", { email: email, otp: otp })
}

exports.handleResetPassword = async (req, res) => {
    const {email, otp} = req.params
    const {newPassword, confirmPassword} = req.body
    if (!email || !otp || !newPassword || !confirmPassword) {
        return res.status(400).send('Please provide email, otp, new password and confirm password')
    }
    if( newPassword !== confirmPassword) {
        return res.status(400).send('New password and confirm password do not match')
    }
    // **Check if the user exists
    const data = await users.findAll({
        where: {
            email: email,
            otp: otp
        }
    })
    if (data.length === 0) {
        return res.status(400).send('Invalid email or OTP')
    }
    // **Check if the OTP is expired 
    const otpGeneratedTime = new Date(data[0].otpGeneratedTime) // Convert the stored string to a Date object
    const currentTime = new Date() // Get the current date and time
    const timeDiff = currentTime - otpGeneratedTime
    const otpExpiryTime = 2 * 60 * 1000 // 2 minutes in milliseconds
    if (timeDiff > otpExpiryTime) {
        return res.status(400).send('OTP has expired')
    }
    // **Reset the password
    await users.update({ 
        password: bcrypt.hashSync(newPassword, 10) // Hash the new password
    }, { where: { 
        email: email 
      } 
    }
    )
    // .then(() => {
    //     // **Clear the OTP and OTP generated time
    //     data[0].otp = null
    //     data[0].otpGeneratedTime = null
    //     data[0].save() // Save the changes to the user
    // })
    .catch(err => {
        console.error('Error resetting password:', err)
        return res.status(500).send('Internal server error')
    })
    // **Send email to the user that the password has been reset successfully
    await sendEmail({
        email: email,
        text: "Your password has been reset successfully!",
        subject: "Password Reset Confirmation"
    })
    // **Redirect to the login page after resetting the password
    res.redirect("/login") 
}

