const { handleAnswer } = require('../controller/answerController');
const { isAuthenticated } = require('../Middleware/isAuthenticated');
const catchError = require('../utils/catchError');

const router = require('express').Router();

router.route("/:id").post(isAuthenticated, catchError(handleAnswer))

module.exports = router;

