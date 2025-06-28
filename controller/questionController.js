require('dotenv').config();
const { QueryTypes } = require('sequelize');
const { questions, users, answers, sequelize } = require("../model");
const { cloudinary } = require('../cloudinary/index');

exports.renderAskQuestionPage = (req, res) => {
    res.render('questions/askQuestion');
};

exports.handleAskQuestion = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId;
    const fileName = req.file.filename;

    const result = await cloudinary.v2.uploader.upload(req.file.path);

    if (!title || !description) {
        return res.send("Please provide title and description");
    }
    await questions.create({
        title: title,
        description: description,
        image: result.url,
        userId: userId
    });
    res.redirect('/');
};

exports.getAllQuestions = async (req, res) => {
    const data = await questions.findAll({
        include: [{
            model: users,
            attributes: ['username']
        }]
    });
    res.render('home', { data, success: req.flash('success') });
};

exports.renderSingleQuestionPage = async (req, res) => {
    const { id } = req.params;
    const data = await questions.findAll({
        where: { id: id },
        include: [{
            model: users,
            attributes: ['username']
        }],
    });

//     if (!data || data.length === 0) {
//             // console.log(`Question with ID ${id} not found`);
//             req.flash('error', 'Question not found');
//             return res.redirect('/');
//       }

    let likes, count = 0;
    try {
        likes = await sequelize.query(`SELECT * FROM likes_${id}`, {
            type: QueryTypes.SELECT
        });
        if (likes.length) {
            count = likes.length;
        }
    } catch (error) {
        console.error("Error fetching likes:", error);
    }

    const answersData = await answers.findAll({
        where: { questionId: id },
        include: [{
            model: users,
            attributes: ['username']
        }]
    });

    const userId = req.userId; // Pass authenticated user ID to template
    res.render('./questions/singleQuestion', { data, answers: answersData, likes: count, userId, isAuthenticated: res.locals.isAuthenticated });
};

exports.renderEditQuestionPage = async (req, res) => {
    const { id } = req.params;
    const question = await questions.findOne({
        where: { id: id },
        include: [{ model: users, attributes: ['username'] }]
    });
    if (!question) {
        req.flash('error', 'Question not found');
        return res.redirect('/');
    }
    if (question.userId !== req.userId) {
        req.flash('error', 'You are not authorized to edit this question');
        return res.redirect(`/question/${id}`);
    }
    res.render('questions/editQuestion', { question, error: req.flash('error') });
};

exports.handleEditQuestion = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const question = await questions.findOne({ where: { id: id } });
    
    if (!question) {
        req.flash('error', 'Question not found');
        return res.redirect('/');
    }
    if (question.userId !== req.userId) {
        req.flash('error', 'You are not authorized to edit this question');
        return res.redirect(`/question/${id}`);
    }
    if (!title || !description) {
        req.flash('error', 'Please provide title and description');
        return res.redirect(`/question/edit/${id}`);
    }

    const updateData = { title, description };
    if (req.file) {
        // Delete old image from Cloudinary
        if (question.image) {
            const publicId = question.image.split('/').pop().split('.')[0];
            await cloudinary.v2.uploader.destroy(publicId);
        }
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        updateData.image = result.url;
    }

    await questions.update(updateData, { where: { id: id } });
    req.flash('success', 'Question updated successfully');
    res.redirect(`/question/${id}`);
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;
    const question = await questions.findOne({ where: { id: id } });
    
    if (!question) {
        return res.status(404).json({ success: false, message: 'Question not found' });
    }
    if (question.userId !== req.userId) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this question' });
    }

    // Delete image from Cloudinary
    if (question.image) {
        const publicId = question.image.split('/').pop().split('.')[0];
        await cloudinary.v2.uploader.destroy(publicId);
    }

    // Delete associated answers and likes
    await answers.destroy({ where: { questionId: id } });
    await sequelize.query(`DROP TABLE IF EXISTS likes_${id}`);
    await questions.destroy({ where: { id: id } });

    res.json({ success: true });
};