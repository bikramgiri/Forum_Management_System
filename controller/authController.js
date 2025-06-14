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
    const data = await questions.findAll(
        {
            include: [{
                model: users,
                attributes: ['username', 'email'] // Include only specific fields from the users table
            }],
            order: [['createdAt', 'DESC']] // Order by createdAt in descending order
        }
    )
    res.render('home', {data: data})
}

exports.renderRegisterPage = (req, res) => {
    res.render('auth/register')
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
        return res.status(400).send('User already exists')
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
    .then(() => {
        res.redirect('/login')
    })
    .catch(err => {
        console.error('Error creating user:', err)
        res.status(500).send('Internal server error')
    })
}

exports.renderLoginPage = (req, res) => {
    res.render('auth/login')
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
        return res.status(400).send('Invalid email')
    }else {
        // **Check if the password is valid
        const isPasswordValid = bcrypt.compareSync(password, data[0].password) // data[0] because findAll returns an array
        if (!isPasswordValid) {
            return res.status(400).send('Invalid password')
        }else {
            // **Generate JWT token
            const token = jwt.sign({ id: data[0].id, email: data[0].email }, process.env.JWT_SECRETKEY, { expiresIn: '1d' }) // Sign the token with a secret key and set expiration time
            // **Set the token in the response header
            res.cookie('jwtToken', token, { 
                httpOnly: true,  // Prevent client-side JavaScript from accessing the cookie
                // secure: true, // Use secure flag to ensure the cookie is sent over HTTPS only
                // sameSite: 'none', // Prevent CSRF attacks by restricting how cookies are sent with cross-site requests
                maxAge: 1000 * 60 * 60 * 48 // 2 days
            }) // Set cookie with httpOnly flag
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
    await data[0].save()

    res.redirect("/verifyOtp")
}

exports.renderVerifyOtpPage = (req, res) => {
    res.render("./auth/verifyOtp")
}

exports.handleVerifyOtp = async (req, res) => {
    

}