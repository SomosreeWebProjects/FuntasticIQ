import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import "./SelectLevel.css";

const SelectLevel = () => {
  const navigate = useNavigate();
  const { subject } = useParams(); // Get subject from URL

  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [showNumberSelection, setShowNumberSelection] = useState(false); // NEW: Show number selection state
  const [numQuestions, setNumQuestions] = useState(10); // Default to 10 questions
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState([""]);

  const handleDifficultySelection = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleGameModeSelection = (mode) => {
    if (mode === "single") {
      setShowNumberSelection(true); // Show number selection instead of navigating
    } else {
      setIsMultiplayer(true);
    }
  };

  const startSinglePlayerGame = () => {
    navigate(`/quiz/${subject}/${selectedDifficulty}?players=1&names=Player 1&questions=${numQuestions}`);
  };

  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(""));
  };

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const startMultiplayerGame = () => {
    const namesQuery = encodeURIComponent(playerNames.join(","));
    navigate(`/quiz/${subject}/${selectedDifficulty}?players=${playerCount}&names=${namesQuery}&questions=50`);
  };

  return (

      <div className="select-level-container">
      <DashboardNavbar />
      {/* Floating icons */}
      <div className="floating-icons-select">
            <span className="icon-select">❓</span>
            <span className="icon-select">🎮</span>
            <span className="icon-select">🎯</span>
            <span className="icon-select">💡</span>
            <span className="icon-select">🎊</span>
            <span className="icon-select">🎉</span>
            <span className="icon-select">🏅</span>
            <span className="icon-select">🔥</span>
            <span className="icon-select">🎲</span>
            <span className="icon-select">🧩</span>
            <span className="icon-select">📚</span>
            <span className="icon-select">🏆</span>
            <span className="icon-select">👥</span>
            <span className="icon-select">✏️</span>
            <span className="icon-select">🧠</span>
            <span className="icon-select">📈</span>
            <span className="icon-select">📊</span>
            <span className="icon-select">🎁</span>
            <span className="icon-select">🌍</span>
            <span className="icon-select">🌟</span>  {/* Star */}
            <span className="icon-select">✅</span>
      </div>
        {!selectedDifficulty ? (
          <div class="animated-border">
          <div className="difficulty-box">
            <h2 className="difficulty-title">Select Difficulty</h2>
            <div className="level-buttons">
              <button className="level easy" onClick={() => handleDifficultySelection("easy")}>EASY</button>
              <button className="level medium" onClick={() => handleDifficultySelection("medium")}>MEDIUM</button>
              <button className="level hard" onClick={() => handleDifficultySelection("hard")}>HARD</button>
            </div>
            <button className="close-button" onClick={() => navigate("/dashboard")}>✖</button>
          </div>
          </div>
        ) : showNumberSelection ? ( // NEW: Show number selection UI
          <div class="animated-border">
          <div className="number-selection">
            <h2>Select Number of Questions</h2>
            <div className="question-count">
            <input
              type="number"
              min="10"
              max="50"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1)))}
            />
            <button className="start-game-button" onClick={startSinglePlayerGame}>Start Game</button>
            </div>
            <button className="close-button" onClick={() => navigate("/dashboard")}>✖</button>
          </div>
          </div>
        ) : !isMultiplayer ? (
          <div class="animated-border">
          <div className="game-mode-selection">
          <div className="game-mode-buttons">
            <h2>Select Game Mode</h2>
            <button className="mode-button single" onClick={() => handleGameModeSelection("single")}>Single Player</button>
            <button className="mode-button multiplayer" onClick={() => handleGameModeSelection("multiplayer")}>Multiplayer</button>
          </div>
          <button className="close-button" onClick={() => navigate("/dashboard")}>✖</button>
          </div>
          </div>
        ) : (
          <div class="animated-border">
          <div className="multiplayer-options">
            <h2>Enter Player Details</h2>
            <label>Number of Players:</label>
            <select value={playerCount} onChange={handlePlayerCountChange}>
              {[...Array(5)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} Players</option>
              ))}
            </select>

            <div className="player-name-inputs">
            <div className="player-form">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Player ${index + 1} Name`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                />
              ))}
            </div>
            </div>
            <button className="start-game-button" onClick={startMultiplayerGame}>Start Game</button>
            <button className="close-button" onClick={() => navigate("/dashboard")}>✖</button>
          </div>
          </div>
        )}
      </div>
  );
};

export default SelectLevel;
