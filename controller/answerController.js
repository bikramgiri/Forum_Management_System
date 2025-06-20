const { QueryTypes } = require("sequelize")
const { answers, sequelize } = require("../model")

exports.handleAnswer = async (req, res) => {
      const userId = req.userId
      const{answer } = req.body
      const{id: questionId} = req.params
      const data = await answers.create({
            answerText: answer,
            userId: userId,
            questionId: questionId
      })

      await sequelize.query(`CREATE TABLE likes_${data.id} (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
      )`, { 
            type: QueryTypes.CREATE
       })

      res.redirect(`/question/${questionId}`)
}


