require('dotenv').config() // Load environment variables from a .env file into process.env
const express = require('express')
const app = express()
const { renderHomePage, renderRegisterPage, renderLoginPage, handleRegister, handleLogin } = require('./controller/authController')

require('./model/index') // Import the database connection and models

const authRoute = require('./routes/authRoute')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // server side form data ko lagi
app.use(express.json()) // client side form data ko lagi

// localhost:3000, localhost:3000 + /register --> localhost:3000/register
app.use("/",authRoute) // for home, register and login Page Routes

app.use(express.static('public/css'))

const PORT = 3000
app.listen(PORT, () => {
    console.log('Project is running at port ' + PORT)
})

