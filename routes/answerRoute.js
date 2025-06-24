const { handleAnswer } = require('../controller/answerController');
const { isAuthenticated } = require('../Middleware/isAuthenticated');
const catchError = require('../utils/catchError');
const sanitizer = require('../utils/sanitizer');

const router = require('express').Router();

router.route("/:id").post(isAuthenticated, sanitizer, catchError(handleAnswer))

module.exports = router;

