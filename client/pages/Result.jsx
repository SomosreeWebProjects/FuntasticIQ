import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import winnerVideo from "/assets/winner.mp4";
import loserVideo from "/assets/loser.mp4";
import "./result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    scores = [],
    totalQuestions = 0,
    playerNames = [],
    subject = "general",
    difficulty = "general"
  } = location.state || {};

  const isMultiplayer = playerNames.length > 1;
  const userScore = scores[0];
  const highestScore = Math.max(...scores);
  const isUserWinner =
    userScore === highestScore &&
    scores.filter(score => score === userScore).length === 1;
  
    useEffect(() => {
      const username = localStorage.getItem("username") || "guest";
      const userQuizHistory = JSON.parse(localStorage.getItem("playedQuizzes")) || {};
      
      const quizRecord = {
        subject,
        difficulty, // ✅ this must be here now
        score: scores[0], // assuming single player for now
        totalQuestions,
        date: new Date().toLocaleDateString()
      };
    
      if (!userQuizHistory[username]) {
        userQuizHistory[username] = [];
      }
      // Check if the quiz for the given subject and date already exists
      const quizExists = userQuizHistory[username].some(
        (quiz) => quiz.subject === quizRecord.subject && quiz.date === quizRecord.date
      );

      userQuizHistory[username].push(quizRecord);
    
      localStorage.setItem("playedQuizzes", JSON.stringify(userQuizHistory));
      
      // ✅ Send score to backend to update MongoDB points
      const pointsToAdd = scores[0] * 5;
      const totalGames = userQuizHistory[username].length;
      const totalCorrect = userQuizHistory[username].reduce((sum, q) => sum + q.score, 0);
      const totalQuestionsOverall = userQuizHistory[username].reduce((sum, q) => sum + q.totalQuestions, 0);
      const totalIncorrect = totalQuestionsOverall - totalCorrect;
      const completionRate = totalQuestionsOverall > 0
      ? Math.round((totalCorrect / totalQuestionsOverall) * 100)
      : 0;

      if (pointsToAdd > 0) {
        fetch("http://localhost:5000/api/update-points", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ points: pointsToAdd }),
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.user) {
            console.log("✅ Points updated in MongoDB:", data.user.points);
          } else {
            console.warn("⚠️ Points update response missing user data:", data);
          }
        })
        .catch(err => {
          console.error("❌ Failed to update points:", err);
        });
      }

      // 🆕 Update stats in MongoDB
      fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          totalGames,
          totalCorrect,
          totalIncorrect,
          completionRate,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Stats saved to MongoDB:", data);
      })
      .catch((err) => {
        console.error("❌ Failed to save stats:", err);
      });
      
    }, []);
      

  return (
    <div className="result-page">
    <div className="dashboard-container">
      <DashboardNavbar />
      {/* Floating icons */}
            <div className="floating-icons-result">
                <span className="icon-result">❓</span>
                <span className="icon-result">🎮</span>
                <span className="icon-result">🎯</span>
                <span className="icon-result">💡</span>
                <span className="icon-result">🎊</span>
                <span className="icon-result">🎉</span>
                <span className="icon-result">🏅</span>
                <span className="icon-result">🔥</span>
                <span className="icon-result">🎲</span>
                <span className="icon-result">🧩</span>
                <span className="icon-result">📚</span>
                <span className="icon-result">🏆</span>
                <span className="icon-result">👥</span>
                <span className="icon-result">✏️</span>
                <span className="icon-result">🧠</span>
                <span className="icon-result">📈</span>
                <span className="icon-result">📊</span>
                <span className="icon-result">🎁</span>
                <span className="icon-result">🌍</span>
                <span className="icon-result">🌟</span>  {/* Star */}
                <span className="icon-result">✅</span>
            </div>
      {isMultiplayer ? (

        <div className="multiplayer-result">
          <h2 className="multiplayer-title">Multiplayer Results</h2>
          {/* 🏆 Winner Announcement */}
          <div className="player-status">
            <h3 className="player-outcome">
              {isUserWinner ? "🎉 You Win!" : "😞 You Lose"}
            </h3>
            
            <video autoPlay loop muted className="result-video">
              <source src={isUserWinner ? winnerVideo : loserVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <p className="player-score">Your Score: {userScore}</p>
          </div>
          <div className="all-players">
            <h4>All Players</h4>
            <ul className="players-list">
              {playerNames.map((name, index) => (
                <li key={index} className="player-item">
                  <span className="player-number">Player {index + 1}:</span>{" "}
                  {name} - {scores[index]} pts
                </li>
              ))}
            </ul>
          </div>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        
        <div className="result-container">
          <h2>Quiz Result</h2>
          <p>Total Questions: {totalQuestions}</p>

          <div className="player-scores">
            {playerNames.map((player, index) => (
              <div key={index} className="player-score-card">
                <h3>{player}</h3>
                <p>Correct Answers: {scores[index]}</p>
                <p>
                  Incorrect Answers:{" "}
                  {totalQuestions / playerNames.length - scores[index]}
                </p>
              </div>
            ))}
          </div>

          <button onClick={() => navigate(`/select-level/${subject}`)}>
            Retry Quiz
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Result;
