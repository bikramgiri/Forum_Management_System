const { answers } = require("../model")

exports.handleAnser = async (req, res) => {
      const userId = req.userId
      const{answer } = req.body
      const{id: questionId} = req.params
      await answers.create({
            answerText: answer,
            userId: userId,
            questionId: questionId
      })
      res.redirect(`/question/${questionId}`)
}


