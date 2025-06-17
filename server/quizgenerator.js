const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

env = require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

// Set up GridFS storage
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return { filename: file.originalname, bucketName: "uploads" };
    },
});

const upload = multer({ storage });

const QuestionSchema = new mongoose.Schema({
    pdfName: String,
    questions: [{ 
        question: String, 
        options: [String], 
        correctAnswer: String 
    }]
});
const QuestionModel = mongoose.model("Questions", QuestionSchema, "questions"); // Use explicit collection name

// Endpoint to upload and parse PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const dataBuffer = await gfs.files.findOne({ filename: req.file.filename });
        const stream = gfs.createReadStream(dataBuffer.filename);
        let pdfData = "";

        stream.on("data", (chunk) => {
            pdfData += chunk.toString();
        });

        stream.on("end", async () => {
            const parsedQuestions = parseQuestions(pdfData);
            await QuestionModel.create({ pdfName: req.file.filename, questions: parsedQuestions });
            res.json({ questions: parsedQuestions });
        });
    } catch (error) {
        console.error("Error processing PDF:", error);
        res.status(500).json({ error: "Error processing PDF" });
    }
});

// Fetch questions from the database
app.get("/questions", async (req, res) => {
    try {
        const questions = await QuestionModel.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching questions" });
    }
});

// Function to parse questions from extracted text
function parseQuestions(text) {
    const questionPattern = /\d+\.\s(.+?)\n([A-D])\.\s(.+?)\n([A-D])\.\s(.+?)\n([A-D])\.\s(.+?)\n([A-D])\.\s(.+?)/g;
    let match;
    const questions = [];

    while ((match = questionPattern.exec(text)) !== null) {
        questions.push({
            question: match[1],
            options: [match[3], match[5], match[7], match[9]],
            correctAnswer: match[3],
        });
    }
    return questions;
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
