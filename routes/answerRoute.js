const { handleAnser } = require('../controller/answerController');
const { isAuthenticated } = require('../Middleware/isAuthenticated');

const router = require('express').Router();

router.route("/:id").post(isAuthenticated, handleAnser)

module.exports = router;

