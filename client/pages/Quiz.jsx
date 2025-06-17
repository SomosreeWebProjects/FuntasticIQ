import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import './Quiz.css';

const Quiz = () => {
    const { subject, difficulty } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Extract players and names from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const players = parseInt(queryParams.get("players")) || 1;
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const username = storedUser?.username || "You";
    
    let playerNames;
    if (players > 1) {
        playerNames = queryParams.get("names")
        ? queryParams.get("names").split(",")
        : Array(players).fill("Player");
    } else {
        playerNames = [username]; // 👈 Use real name in single-player
    }

    // State Variables
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [answeredQuestions, setAnsweredQuestions] = useState({});
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // Track active player
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState(Array(players).fill(0)); // Scores for each player
    const [timeLeft, setTimeLeft] = useState(null); // No timer until questions are ready
    const [playerName, setPlayerName] = useState("Loading...");

    const shuffleArray = (array) => {
        return array
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
    };

    useEffect(() => {
        setLoading(true);
        fetch("/c_prog.json") // Fetch questions from the JSON file
            .then(response => response.json())
            .then(data => {
                let subjectQuestions = [];
                if (data[subject] && data[subject][difficulty]) {
                    subjectQuestions = data[subject][difficulty];
                }
                // Extract 'numQuestions' from the URL
                const numQuestions = parseInt(queryParams.get("questions")) || subjectQuestions.length;

                 // Shuffle the questions before using them
                 const shuffledQuestions = shuffleArray(subjectQuestions);

                // If multiplayer, always use 50 questions and split them
                const finalQuestions = players > 1
                ? shuffledQuestions.slice(0, 50)
                : shuffledQuestions.slice(0, numQuestions);
                
                setQuestions(finalQuestions);
                setTimeLeft(finalQuestions.length * 60); // Start timer
            })
            .catch(error => {
                console.error("Error fetching questions:", error);
                setQuestions([]);
            })
            .finally(() => setLoading(false));
    }, [subject, difficulty]);

    useEffect(() => {
        if (timeLeft === null) return;
      
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              handleSubmit(); // Auto-submit
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      
        return () => clearInterval(timer);
      }, [timeLeft]);

      useEffect(() => {
        const loadName = async () => {
          const name = await fetchUserNameFromToken();
          setPlayerName(name);
        };
        loadName();
      }, []);

    if (loading) return <p>Loading...</p>;

    // Determine how many questions each player gets
    const questionsPerPlayer = Math.floor(questions.length / players);

    const handleSelectAnswer = (questionIndex, answer) => {
        if (answeredQuestions[questionIndex]) return; // Prevent multiple attempts

        const correctAnswer = questions[questionIndex].answer;
        let updatedAnswers = { ...selectedAnswers, [questionIndex]: answer };
        let updatedScores = [...scores];

        // Check if the selected answer is correct
        if (answer === correctAnswer) {
            updatedAnswers = { ...updatedAnswers, [`${questionIndex}-correct`]: answer };
            updatedScores[currentPlayerIndex] += 1; // Increment score for active player
        }else {
            // Mark as incorrect and also highlight the correct answer
            updatedAnswers = { ...updatedAnswers, [`${questionIndex}-incorrect`]: answer, [`${questionIndex}-correct-answer`]: correctAnswer };
        }

        setSelectedAnswers(updatedAnswers);
        setAnsweredQuestions({ ...answeredQuestions, [questionIndex]: true });
        setScores(updatedScores);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            if (players > 1) {
                setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players); // Switch to next player
            }
        } else {
            if (players > 1) {
                // Multiplayer: Check for elimination
                let maxScore = Math.max(...scores);
                let remainingPlayers = scores.map((score, index) => score === maxScore ? index : null).filter(i => i !== null);
    
                if (remainingPlayers.length === 1) {
                    navigate("/Result", { state: { winner: playerNames[remainingPlayers[0]], scores, totalQuestions: questions.length, playerNames, subject, difficulty } });
                } else {
                    // Restart with remaining players
                    setCurrentPlayerIndex(remainingPlayers[0]);
                    setCurrentQuestionIndex(0);
                }
            } else {
                // Single-player: Go to results
                navigate("/Result", { state: { scores, totalQuestions: questions.length, playerNames, subject } });
            }
        }

    };

    const handleSubmit = () => {
        navigate("/Result", { state: { scores, totalQuestions: questions.length, playerNames, subject } });
    };

    return (
        <div className="quiz-container">
            <DashboardNavbar />
            {/* Floating icons */}
            <div className="floating-icons-quiz">
                <span className="icon-quiz">❓</span>
                <span className="icon-quiz">🎮</span>
                <span className="icon-quiz">🎯</span>
                <span className="icon-quiz">💡</span>
                <span className="icon-quiz">🎊</span>
                <span className="icon-quiz">🎉</span>
                <span className="icon-quiz">🏅</span>
                <span className="icon-quiz">🔥</span>
                <span className="icon-quiz">🎲</span>
                <span className="icon-quiz">🧩</span>
                <span className="icon-quiz">📚</span>
                <span className="icon-quiz">🏆</span>
                <span className="icon-quiz">👥</span>
                <span className="icon-quiz">✏️</span>
                <span className="icon-quiz">🧠</span>
                <span className="icon-quiz">📈</span>
                <span className="icon-quiz">📊</span>
                <span className="icon-quiz">🎁</span>
                <span className="icon-quiz">🌍</span>
                <span className="icon-quiz">🌟</span>  {/* Star */}
                <span className="icon-quiz">✅</span>
            </div>

            <div className="player-info">
                <h3>Players: {playerNames.join(", ")}</h3>
                <p>Current Player: <strong>{playerNames[currentPlayerIndex]}</strong></p>
            </div>
            <div className="quiz-header">
            <div className="quiz-timer-wrapper">
                <div className="circle-timer">
                    <svg viewBox="0 0 36 36">
                        <path
                        className="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                        className="circle"
                        strokeDasharray={`${(timeLeft / (questions.length * 60)) * 100}, 100`}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="timer-text">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </text>
                    </svg>
                </div>
            </div>
            </div>
            <div className="quiz-layout">
            {players === 1 && (
            <div class="animated-borderquiz">
            <div className="question-sidebar">
                <h4>Quiz navigation</h4>
                <div className="question-grid">
                    {questions.map((_, idx) => (
                        <button
                        key={idx}
                        className={`question-box ${currentQuestionIndex === idx ? 'current' : ''} ${answeredQuestions[idx] ? 'answered' : ''}`}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
                <div className="finish-attempt">
                    <button onClick={handleSubmit}>Finish attempt ...</button>
                </div>
            </div>
            </div>
            )}
            <div className="quiz-content">
                {questions.length === 0 ? (
                    <p className="no-questions">No questions available.</p>
                ) : (
                    <div className="quiz-question">
                        <h3 className="question-text">
                            {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
                        </h3>
                        <div className="options-container">
                            {questions[currentQuestionIndex].options.map((option, i) => {
                                let buttonClass = "option-button";
                                
                                if (selectedAnswers[`${currentQuestionIndex}-correct`] === option) {
                                    buttonClass += " correct"; // User selected correct answer
                                } else if (selectedAnswers[`${currentQuestionIndex}-incorrect`] === option) {
                                    buttonClass += " wrong"; // User selected incorrect answer
                                } else if (selectedAnswers[`${currentQuestionIndex}-correct-answer`] === option) {
                                    buttonClass += " correct-answer"; // Highlight correct answer if the user was wrong
                                }
                                return (
                                <button
                                key={i}
                                className={buttonClass}
                                onClick={() => handleSelectAnswer(currentQuestionIndex, option)}
                                disabled={answeredQuestions[currentQuestionIndex]}
                                >
                                    {option}
                                    {selectedAnswers[currentQuestionIndex] === option ? (
                                        option === questions[currentQuestionIndex].answer ? " ✅" : " ❌"
                                    ) : ""}
                                </button>
                            );
                        })}
                        </div>

                        {currentQuestionIndex < questions.length - 1 ? (
                            <button className="next-button" onClick={handleNextQuestion}>
                                Next Question (Next: {playerNames[(currentPlayerIndex + 1) % players]})
                            </button>
                        ) : (
                            <button className="submit-button" onClick={handleSubmit}>
                                Submit Quiz
                            </button>
                        )}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default Quiz;
