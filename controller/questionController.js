require('dotenv').config() // Load environment variables from a .env file into process.env
const { questions, users, answers } = require("../model")

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
            image: `${process.env.PROJECT_URL}${fileName}`, // Assuming you have a file upload middleware that saves the file and provides the filename 
            userId: userId
      })
      res.redirect('/')
}

exports.getAllQuestions = async (req, res) => {
      const data = await questions.findAll({
            include: [{
                  model: users
            }]
      })
}

exports.renderSingleQuestionPage = async (req, res) => {
      const { id } = req.params
          const data = await questions.findAll(
        {
            where: { 
                  id: id 
            }, // Find the question by its ID
            include: [{
                model: users,
                attributes: ['username'] // Include only specific fields from the users table
            }],
        }
    )
    const answersData = await answers.findAll({
        where: {
            questionId: id
        },
        include: [{
            model: users,
            attributes: ['username']
        }]
    })
    res.render('./questions/singleQuestion', {data: data, answers: answersData}) // Render the single question page with the question data;
}


