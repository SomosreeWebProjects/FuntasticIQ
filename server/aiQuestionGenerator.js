import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateQuiz(subject) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

    const prompt = `Generate a multiple-choice question for a ${subject} quiz.
    Provide a question, 4 answer options (A, B, C, D), and indicate the correct answer.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Error generating question:", error);
    return null;
  }
}
