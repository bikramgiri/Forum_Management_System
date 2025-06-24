const sanitizeHtml = require('sanitize-html')


const sanitizer = (req,res,next) =>{
      // console.log(req.body)
      for (const key in req.body){
            // console.log(key)
            req.body[key] = sanitizeHtml(req.body[key], {
                  allowedTags: [],
                  allowedAttributes: {}
            })
      }
      next()
}

module.exports = sanitizer