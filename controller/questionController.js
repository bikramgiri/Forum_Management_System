const { questions, users } = require("../model")

exports.renderAskQuestionPage = (req, res) => {
      res.render('questions/askQuestion')
}

exports.handleAskQuestion = async (req, res) => {
      const {title,description} = req.body
      const userId = req.userId
      const fileName = req.file.filename
      if(!title || !description){
            return res.send("Please provide title and description")
      }
      await questions.create({
            title: title,
            description: description,
            image: fileName,
            userId : userId
      })
      res.redirect('/')
}

exports.getAllQuestions = async (req, res) => {
      const data = await questions.findAll({
            include : [{
                  model: users
            }]
      })
}