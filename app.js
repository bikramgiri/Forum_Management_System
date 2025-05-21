const express = require('express')
const app = express()

app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    const name = 'John Doe'
    const address = 'Itahari'
    res.render('home', { name: name, address: address })
})

app.get('/about', (req, res) => {
    res.render('about.ejs')
})




app.listen(3000, () => {
    console.log('Project is running on port 3000')
})

