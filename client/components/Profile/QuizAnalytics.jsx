import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './QuizAnalytics.css';


const COLORS = ['#00C49F', '#FF8042', '#0088FE'];

const QuizAnalytics = ({ quizzes }) => {
  // Group by subject
  const subjectAccuracy = quizzes.reduce((acc, quiz) => {
    const { subject, score, totalQuestions } = quiz;
    if (!acc[subject]) acc[subject] = { subject, correct: 0, total: 0 };
    acc[subject].correct += score;
    acc[subject].total += totalQuestions;
    return acc;
  }, {});

  const accuracyData = Object.values(subjectAccuracy).map((item) => ({
    subject: item.subject,
    accuracy: Math.round((item.correct / item.total) * 100)
  }));

  // Group by difficulty (assumes difficulty is in quiz object)
  const difficultyStats = quizzes.reduce((acc, quiz) => {
    const level = quiz.difficulty || 'unknown';
    if (!acc[level]) acc[level] = { name: level, count: 0 };
    acc[level].count += 1;
    return acc;
  }, {});

  const difficultyData = Object.values(difficultyStats);

  return (
    <div className="analytics-section">
      <h3>📊 Quiz Performance Analytics</h3>

      <div style={{ height: 300 }}>
        <h4>Accuracy by Subject</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={accuracyData}>
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 300, marginTop: 30 }}>
        <h4>Quizzes per Difficulty</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={difficultyData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {difficultyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuizAnalytics;
