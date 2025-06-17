import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/signup');
    };

    return (
        <div className="home-container">
            <div className="floating-icons-home">
                <span className="icon">❓</span>
                <span className="icon">🎮</span>
                <span className="icon">🎯</span>
                <span className="icon">💡</span>
                <span className="icon">🎊</span>
                <span className="icon">🎉</span>
                <span className="icon">🏅</span>
                <span className="icon">🔥</span>
                <span className="icon">🎲</span>
                <span className="icon">🧩</span>
                <span className="icon">📚</span>
                <span className="icon">🏆</span>
                <span className="icon">👥</span>
                <span className="icon">✏️</span>
                <span className="icon">🧠</span>
                <span className="icon">📈</span>
                <span className="icon">📊</span>
                <span className="icon">🎁</span>
                <span className="icon">🌍</span>
                <span className="icon">🌟</span>  {/* Star */}
                <span className="icon">✅</span>
            </div>
            {/* Welcome Section */}
            <div className="welcome-section">
                <h1>Welcome to FuntasticIQ 🎉</h1>
                <p>Your one-stop destination for fun and knowledge!</p>
                <button onClick={() => navigate("/login")}>Get Started</button>
            </div>
        
            {/* Additional Content Container */}
            <div className="additional-content-container">
                <div className="content-sections"> 
                {/* Why Choose Section */}
                <div className="why-choose-section">
                    <h2>Why Choose FuntasticIQ?</h2>
                    <ul>
                        <li>💡 Fun Meets Knowledge!</li>
                        <li>🏆 Compete & Win!</li>
                        <li>🎯 Personalized Learning</li>
                        <li>🔥 Daily Challenges & Rewards</li>
                        <li>👥 Play Solo or With Friends</li>
                        <li>📊 Track Your Progress</li>
                        <li>🌎 Explore Diverse Topics</li>
                    </ul>
                </div>

                {/* What's In It Section */}
                <div className="whats-in-it-section">
                    <h2>What's in it for You?</h2>
                    <ul>
                    <li>🎓 Boost your knowledge while having fun.</li>
                    <li>🧠 Stay ahead with daily brain workouts.</li>
                    <li>🤝 Engage in friendly competition with other quiz lovers.</li>
                    <li>🏅 Unlock badges & rewards for your achievements.</li>
                    <li>📝 Never a dull moment with fresh quizzes every day!</li>
                    </ul>
                </div>
                </div>
            </div>
        <footer className="footer-home">
            <p>© 2025 FuntasticIQ. All rights reserved.</p>
        </footer>
        </div>
        
    );
}

export default Home;
