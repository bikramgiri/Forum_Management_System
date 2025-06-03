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

app.post('/register', async (req, res) => {
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
})

app.get("/login", (req, res) => {
    res.render('auth/login')
})

app.post("/login", async (req, res) => {
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
    const data = await users.findAll({
        where: {
            email: email
        }
    })
    if (data.length === 0) {
        return res.status(400).send('Invalid email')
    }else{ 
    // **Check if the password is valid
    const isPasswordValid = bcrypt.compareSync(password, data.password)
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password')
    }}

    
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

    res.redirect('/')
})


app.use(express.static('public/css'))

const PORT = 3000
app.listen(PORT, () => {
    console.log('Project is running at port ' + PORT)
})

