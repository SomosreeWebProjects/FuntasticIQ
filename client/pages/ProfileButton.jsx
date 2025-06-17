// ProfileButton.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProfileButton = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token from storage
    setIsAuthenticated(false); // Update state
  };

  return (
    <li className="profile-dropdown">
      <Link to="/profile" className="nav-link">Profile</Link>
      <button onClick={handleLogout} className="nav-button">Logout</button>
    </li>
  );
};

export default ProfileButton;
