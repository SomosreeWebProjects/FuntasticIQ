// Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();

  // Hide this navbar when on the dashboard
  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">
            <h1>FuntasticIQ</h1>
            <p className="navbar-tagline">Game On, Brain On!</p>
          </Link>
        </div>
        <nav className="navbar-menu">
          <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/quiz" className="nav-link">Quiz</Link></li>
                <li><Link to="/profile" className="nav-link">Profile</Link></li> 
                <li>
                  <button onClick={() => setIsAuthenticated(false)} className="nav-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="nav-link">Login</Link></li>
                <li><Link to="/signup" className="nav-button">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
