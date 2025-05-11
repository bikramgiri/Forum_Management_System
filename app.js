const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>')
})

app.get('/about', (req, res) => {   
      res.send('About Page')
})




app.listen(3000, () => {
    console.log('Project is running on port 3000')
})

