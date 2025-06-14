require('dotenv').config() // Load environment variables from a .env file into process.env
const express = require('express')
const app = express()

const { renderHomePage } = require('./controller/authController')
const cookieParser = require('cookie-parser')

require('./model/index') // Import the database connection and models

const authRoute = require('./routes/authRoute')
const questionRoute = require('./routes/questionRoute')
const answerRoute = require('./routes/answerRoute')
const jwt = require("jsonwebtoken")
const {promisify} = require("util")

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // server side form data ko lagi
app.use(express.json()) // client side form data ko lagi
app.use(cookieParser()) // Middleware to parse cookies

app.use(async (req, res, next)=>{
    const token = req.cookies.jwtToken // Get the token from cookies
    try {
        const decrytedResult = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY)
    if(decrytedResult) {
        res.locals.isAuthenticated = true
    }else{
        res.locals.isAuthenticated = false
    }
    } catch (error) {
        res.locals.isAuthenticated = false
    }
    next()
})

app.get("/", renderHomePage)
// localhost:3000, localhost:3000 + /register --> localhost:3000/register
app.use("/",authRoute) // for home, register and login Page Routes
app.use("/",questionRoute) // for question related routes
app.use("/answer",answerRoute) // for answer related routes

app.use(express.static('./storage/'))
app.use(express.static('public/css'))

const PORT = 3000
app.listen(PORT, () => {
    console.log('Project is running at port ' + PORT)
})

