require('dotenv').config()
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const { users } = require('../model')

exports.isAuthenticated = async (req, res, next) => {
      const token = req.cookies.jwtToken 
      if(!token || token === null ||token === undefined) {
            return res.redirect("/login")
      }
      const decrytedResult = await promisify(jwt.verify)(token, process.env.JWT_SECRETKEY)
      const data = await users.findByPk(decrytedResult.id)
      if(!data) {
            // return res.send("Invalid token")
            return res.redirect("/login")
      }
      req.userId = decrytedResult.id
      next()
}