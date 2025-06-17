import express from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";

const router = express.Router();

// Multer storage config
const upload = multer({ dest: "uploads/" });

// MongoDB Schema
const questionSchema = new mongoose.Schema({
  subject: String,
  question: String,
  options: [String],
  correct_answer: String,
});

const Question = mongoose.model("Question", questionSchema);

// 📌 File Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  const { subject } = req.body;

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const questions = [];

  // 📌 CSV File Handling
  if (req.file.mimetype === "text/csv") {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.Question && row.Correct) {
          questions.push({
            subject,
            question: row.Question,
            options: [row.Option1, row.Option2, row.Option3, row.Correct],
            correct_answer: row.Correct,
          });
        }
      })
      .on("end", async () => {
        await Question.insertMany(questions);
        fs.unlinkSync(filePath); // Remove file after processing
        res.json({ message: "Questions uploaded successfully!", count: questions.length });
      });
  } else {
    res.status(400).json({ error: "Invalid file format (only CSV allowed)" });
  }
});

// 📌 Fetch Questions for a Subject
router.get("/questions/:subject", async (req, res) => {
  const { subject } = req.params;
  const questions = await Question.find({ subject });

  if (questions.length === 0) {
    return res.status(404).json({ error: "No questions found for this subject" });
  }
  res.json(questions);
});

export default router;
