require('dotenv').config() // Load environment variables from a .env file into process.env
const express = require('express')
const { users } = require('./model/index')
const app = express()
const bcrypt = require('bcrypt')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // server side form data ko lagi
app.use(express.json()) // client side form data ko lagi

require('./model/index') // Import the database connection and models


app.get('/', (req, res) => {
    res.render('home')
})

app.get("/register", (req, res) => {
    res.render('auth/register')
})

app.get("/login", (req, res) => {
    res.render('auth/login')
})

app.post("/register", async (req, res) => {
    // **Perfrom Destructuring
    // const username = req.body.username
    // const email = req.body.email
    // const password = req.body.password
    // **OR
    const { username, email, password } = req.body

    await users.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 10) // Hashing the password
    })
    .then(() => {
        res.redirect('/login') 
    })
})


app.use(express.static('public/css'))


const PORT = 3000
app.listen(PORT, () => {
    console.log('Project is running at port ' + PORT)
})

