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
const session = require('express-session')
const flash = require('connect-flash')
const socketio = require('socket.io')
const { answers, sequelize } = require('./model/index')
const { QueryTypes } = require('sequelize')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // server side form data ko lagi
app.use(express.json()) // client side form data ko lagi
app.use(cookieParser()) // Middleware to parse cookies
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
    resave: false, // Forces session to be saved back to the session store
    saveUninitialized: false, // Don't create a session until something is stored
    // cookie: {
    //     maxAge: 1000 * 60 * 60 * 24 * 2 // Cookie expiration time (2 days)
    // }
}))
app.use(flash()) // Middleware for flash messages

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

// app.get("/", renderHomePage)
// **OR
// localhost:3000, localhost:3000 + /register --> localhost:3000/register
app.use("/",authRoute) // for home, register and login Page Routes
app.use("/",questionRoute) // for question related routes
app.use("/answer",answerRoute) // for answer related routes

app.use(express.static('./storage/'))
app.use(express.static('public/css'))

const PORT = 3000
const server = app.listen(PORT, () => {
    console.log('Project is running at port ' + PORT)
})

const io = socketio(server, {
    cors: {
        // origin: "http://localhost:3000", // Allow requests from this origin
        origin : "*", // Allow requests from all origins (for development purposes)
        // origin: "https://your-production-domain.com", // For production, replace with your actual domain
        methods: ["GET", "POST"], // Allowed HTTP methods
        credentials: true // Allow cookies to be sent with requests
    }
})

io.on("connection", (socket) => {
  socket.on("like", async ({ answerId, token }) => {
  // console.log("Like event received:", { answerId, token });
      // Check if answer exists
      const answer = await answers.findByPk(answerId);
      if (answer && token) {
      // Verify JWT token
      const decrytedResult = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY);
      if(decrytedResult){
       const user = await sequelize.query(`SELECT * FROM  likes_${answerId} WHERE userId=${decrytedResult.id}`, {
          type: QueryTypes.SELECT
        });
        if(user.length == 0){
        await sequelize.query(`INSERT INTO likes_${answerId} (userId) VALUES(${decrytedResult.id})`, {
          type: QueryTypes.INSERT
        });
        }
      }

    const likes = await sequelize.query(`SELECT * FROM likes_${answerId}`, {
      type: QueryTypes.SELECT
    });

    const likesCount = likes.length
    socket.emit("likeUpdate", {likesCount, answerId});
    }
  });
});
