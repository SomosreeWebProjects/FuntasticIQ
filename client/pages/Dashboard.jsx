import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import "./Dashboard.css";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [animateCards, setAnimateCards] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateCards(true);
    }, 100); // Wait for DOM to mount
  
    return () => clearTimeout(timeout);
  }, []);

   // Get the username from localStorage
   const username = localStorage.getItem("username") || "User";


  const quizSubjects = [
    { name: "C Programming", icon: "/assets/c-programming.png", link: "/select-level/c-programming" },
    { name: "Computer Architecture", icon: "/assets/computer-architecture.png", link: "/select-level/computer-architecture" },
    { name: "Web Design", icon: "/assets/web-design.png", link: "/select-level/web-design" },
    { name: "Artificial Intelligence", icon: "/assets/AI.png", link: "/select-level/artificial-intelligence" },
    { name: "Data Structures", icon: "/assets/data-structures.png", link: "/select-level/data-structures" },
    { name: "Operating Systems", icon: "/assets/operating-systems.png", link: "/select-level/operating-systems" },
    { name: "Database Management", icon: "/assets/database-management.png", link: "/select-level/database-management" },
    { name: "Computer Networks", icon: "/assets/computer-networks.png", link: "/select-level/computer-networks" },
    { name: "Machine Learning", icon: "/assets/machine-learning.png", link: "/select-level/machine-learning" },
    { name: "Cloud Computing", icon: "/assets/cloud-computing.png", link: "/select-level/cloud-computing" },
    { name: "Software Engineering", icon: "/assets/software-engineering.png", link: "/select-level/software-engineering" },
    { name: "Cybersecurity", icon: "/assets/cybersecurity.png", link: "/select-level/cybersecurity" },
    { name: "C++ Programming", icon: "/assets/c++.png", link: "/select-level/c++-programming" },
    { name: "Python Programming", icon: "/assets/python.png", link: "/select-level/python-programming" },
    { name: "Java Programming", icon: "/assets/java.png", link: "/select-level/java-programming" },
  ];

  const filteredSubjects = quizSubjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Search bar */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
        type="text"
        placeholder="Search subject..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow click
        />
      </div>
      <DashboardNavbar />
      <div className={`dashboard-blur-wrapper ${isFocused && searchTerm ? "blurred" : ""}`}>
      {/* Floating icons */}
      <div className="floating-icons-dashboard">
            <span className="icon-dashboard">❓</span>
            <span className="icon-dashboard">🎮</span>
            <span className="icon-dashboard">🎯</span>
            <span className="icon-dashboard">💡</span>
            <span className="icon-dashboard">🎊</span>
            <span className="icon-dashboard">🎉</span>
            <span className="icon-dashboard">🏅</span>
            <span className="icon-dashboard">🔥</span>
            <span className="icon-dashboard">🎲</span>
            <span className="icon-dashboard">🧩</span>
            <span className="icon-dashboard">📚</span>
            <span className="icon-dashboard">🏆</span>
            <span className="icon-dashboard">👥</span>
            <span className="icon-dashboard">✏️</span>
            <span className="icon-dashboard">🧠</span>
            <span className="icon-dashboard">📈</span>
            <span className="icon-dashboard">📊</span>
            <span className="icon-dashboard">🎁</span>
            <span className="icon-dashboard">🌍</span>
            <span className="icon-dashboard">🌟</span>  {/* Star */}
            <span className="icon-dashboard">✅</span>
      </div>

      <header className="dashboard-header">
        <h1>Hi, {username} <span>👋</span></h1>
        <p>Let's make this day productive</p>
      </header>

      <section className="quiz-section">
        {quizSubjects.map((subject, index) => (
          <div key={index} 
          className={`quiz-card ${animateCards ? "animate-in" : ""}`} 
          style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src={subject.icon} alt={subject.name} className="quiz-icon" />
            <h3>{subject.name}</h3>
            <Link to={subject.link} className="start-btn">
            Start Quiz
            </Link>
            </div>
        ))}
      </section>


      <footer className="footer-dashboard">
        <p>© 2025 FuntasticIQ. All rights reserved.</p>
      </footer>
      </div>
    
      {isFocused && searchTerm && (
        <div className="search-dropdown">
          <div className="search-overlay">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
            <Link
            to={subject.link}
            key={index}
            className="search-dropdown-item"
            >
              <img src={subject.icon} alt={subject.name} className="dropdown-icon" />
              {subject.name}
            </Link>
            ))
          ) : (
          <div className="search-dropdown-item no-results">No subjects found</div>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
