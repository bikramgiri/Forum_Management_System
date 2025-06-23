require('dotenv').config() // Load environment variables from a .env file into process.env
const { QueryTypes } = require('sequelize')
const { questions, users, answers, sequelize } = require("../model")
const {cloudinary} = require('../cloudinary/index') // Import Cloudinary configuration

exports.renderAskQuestionPage = (req, res) => {
      res.render('questions/askQuestion')
}

exports.handleAskQuestion = async (req, res) => {
      const {title,description} = req.body

      const userId = req.userId
      const fileName = req.file.filename

      // **For cloudinary Storage
      const result = await cloudinary.v2.uploader.upload(req.file.path)

      if(!title || !description){
            return res.send("Please provide title and description")
      }
      await questions.create({
            title: title,
            description: description,
            // **For Multer Storage
            // image: `${process.env.PROJECT_URL}${fileName}`, 
            // **Or
            // image: fileName, // Use the filename from multer storage

            // **For cloudinary
            image: result.url, // Use the secure URL from Cloudinary

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

    let likes, count = 0
    try {
      likes = await sequelize.query(`SELECT * FROM likes_${id}`, {
        type: QueryTypes.SELECT
    })
    if(likes.length){
      count = likes.length
    }
    } catch (error) {
      console.error("Error fetching likes:", error)
    }

    const answersData = await answers.findAll({
        where: {
            questionId: id
        },
        include: [{
            model: users,
            attributes: ['username']
        }]
    })
    res.render('./questions/singleQuestion', {data: data, answers: answersData, likes: count}) // Render the single question page with the question data;
}


