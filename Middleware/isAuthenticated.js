require('dotenv').config()
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const { users } = require('../model')

exports.isAuthenticated = async (req, res, next) => {
      const token = req.cookies.jwtToken 
      if(!token || token === null ||token === undefined) {
            console.log('No token found, redirecting to login');
            return res.redirect("/login")
      }
      try {
                  const decrytedResult = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY)
      const data = await users.findByPk(decrytedResult.id)
      if(!data) {
            // return res.send("Invalid token")
            console.log('User not found for token ID:', decrytedResult.id);
            return res.redirect("/login")
      }
      req.userId = decrytedResult.id
      console.log('Authenticated user ID:', req.userId); // Debug
      next()
      } catch (error) {
      console.error('Error during authentication:', error);
      // return res.redirect("/login")
      }
}