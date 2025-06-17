import React from "react";
import { Link } from "react-router-dom";
import "./DashboardNavbar.css"; // Create a new CSS file for styling

const DashboardNavbar = ({ setIsAuthenticated }) => (
  <header className="dashboard-navbar">
    <div className="dashboard-nav-content">
      <div className="dashboard-brand">
        <h1>FuntasticIQ</h1>
        <p className="dashboard-tagline">Game On, Brain On!</p>
      </div>
      <nav className="dashboard-nav-menu">
        <ul>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/profile" className="nav-link">Profile</Link></li>
          <li>
            <button
            onClick={() => {
              localStorage.clear(); // Clear all user data
              window.location.href = "/Login"; // Redirect to login page
              }}
              className="nav-button"
            >
              Logout
            </button>
          </li>

        </ul>
      </nav>
    </div>
  </header>
);

export default DashboardNavbar;
