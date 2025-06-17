const axios = require('axios');
const Score = require('../models/score'); // Import Score model

// ✅ Generate Quiz Without Storing in Database
const generateQuiz = async (req, res) => {
    try {
        const { subject, difficulty, numberOfQuestions } = req.body;
        const amount = numberOfQuestions || 5; // Default to 5 questions

        // Ensure difficulty is valid (easy, medium, hard)
        const validDifficulties = ["easy", "medium", "hard"];
        if (!validDifficulties.includes(difficulty.toLowerCase())) {
            return res.status(400).json({ error: "Invalid difficulty level. Choose 'easy', 'medium', or 'hard'." });
        }

        // Open Trivia DB categories
        const categoryMap = {
            "General Knowledge": 9,
            "Science": 17,
            "Math": 19,
            "History": 23,
            "Computers": 18
        };

        if (!categoryMap[subject]) {
            return res.status(400).json({ error: "Invalid subject. Choose from: General Knowledge, Science, Math, History, Computers." });
        }

        // Fetch questions from Open Trivia DB
        const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${categoryMap[subject]}&difficulty=${difficulty.toLowerCase()}&type=multiple`;
        const response = await axios.get(apiUrl);

        if (response.data.response_code !== 0) {
            return res.status(500).json({ error: "Failed to fetch quiz questions from Open Trivia DB." });
        }

        // Format questions (DO NOT store in DB)
        const quizData = response.data.results.map(q => ({
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: q.correct_answer // Keep correct answers for checking in session
        }));

        // Store questions in session temporarily
        req.session.quizData = quizData; 

        // Return quiz questions without correct answers
        res.json({ 
            success: true, 
            quiz: quizData.map(q => ({ question: q.question, options: q.options })) 
        });

    } catch (error) {
        console.error("Quiz Generation Error:", error);
        res.status(500).json({ error: "Failed to generate quiz." });
    }
};

// ✅ Submit Answers and Store Score
const submitQuiz = async (req, res) => {
    try {
        const { playerName, answers } = req.body;

        if (!req.session.quizData) {
            return res.status(400).json({ error: "No active quiz found. Generate a new quiz first." });
        }

        let quizData = req.session.quizData;
        let score = 0;
        let totalQuestions = quizData.length;
        let results = [];

        // Check answers
        quizData.forEach((question, index) => {
            const userAnswer = answers[index]; 
            const isCorrect = userAnswer === question.correctAnswer; 
            if (isCorrect) {
                score++;
            }
            results.push({
                question: question.question,
                correctAnswer: question.correctAnswer,
                userAnswer,
                isCorrect
            });
        });

        // Save score in MongoDB
        const newScore = new Score({
            playerName,
            subject: "Computers", // Static since we don’t store quizzes
            difficulty: "medium",
            score,
            totalQuestions
        });

        await newScore.save();

        // Clear session data
        req.session.quizData = null;

        res.json({
            success: true,
            totalQuestions,
            score,
            results
        });

    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ error: "Failed to submit quiz." });
    }
};

// ✅ Get Player Scores
const getScores = async (req, res) => {
    try {
        const scores = await Score.find().sort({ date: -1 }); 
        res.json({ success: true, scores });
    } catch (error) {
        console.error("Error fetching scores:", error);
        res.status(500).json({ error: "Failed to fetch scores." });
    }
};

module.exports = { generateQuiz, submitQuiz, getScores };
