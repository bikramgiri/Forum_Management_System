const express = require('express')
const app = express()

app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('home')
})

app.get("/register", (req, res) => {
    res.render('auth/register')
})

app.get("/login", (req, res) => {
    res.render('auth/login')
})


app.use(express.static('public/css'))


const PORT = 3000
app.listen(PORT, () => {
    console.log('Project is running at port ' + PORT)
})

