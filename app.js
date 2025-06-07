require('dotenv').config() // Load environment variables from a .env file into process.env
const express = require('express')
const { users } = require('./model/index')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { renderHomePage, renderRegisterPage, renderLoginPage, handleRegister, handleLogin } = require('./controller/authController')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // server side form data ko lagi
app.use(express.json()) // client side form data ko lagi

require('./model/index') // Import the database connection and models

app.get('/',renderHomePage)

app.get("/register",renderRegisterPage)

app.post('/register',handleRegister)

app.get("/login",renderLoginPage)

app.post("/login",handleLogin)


app.use(express.static('public/css'))

const PORT = 3000
app.listen(PORT, () => {
    console.log('Project is running at port ' + PORT)
})

