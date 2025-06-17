const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    subject: String,
    difficulty: String,
    questions: [
        {
            question: String,
            options: [String],
            answer: String,
        },
    ],
});

//const Quiz = mongoose.model("QuizQuestions", quizSchema);
//module.exports = Quiz;
