const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    playerName: String, // Player's name
    subject: String, // Quiz subject
    difficulty: String, // Quiz difficulty
    score: Number, // Player's score
    totalQuestions: Number, // Total questions in quiz
    date: { type: Date, default: Date.now } // Timestamp
});

const Score = mongoose.model("Score", scoreSchema);
module.exports = Score;
