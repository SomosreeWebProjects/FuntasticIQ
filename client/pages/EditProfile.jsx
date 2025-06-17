// ✅ EditProfile.jsx (Frontend Only - No Backend)
import React, { useState } from 'react';
import DashboardNavbar from "../components/DashboardNavbar";
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Frontend-only fake save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="edit-profile">
      <DashboardNavbar />
    <div className="edit-profile-container">
      {/* Floating icons */}
      <div className="floating-icons-editprofile">
            <span className="icon-editprofile">❓</span>
            <span className="icon-editprofile">🎮</span>
            <span className="icon-editprofile">🎯</span>
            <span className="icon-editprofile">💡</span>
            <span className="icon-editprofile">🎊</span>
            <span className="icon-editprofile">🎉</span>
            <span className="icon-editprofile">🏅</span>
            <span className="icon-editprofile">🔥</span>
            <span className="icon-editprofile">🎲</span>
            <span className="icon-editprofile">🧩</span>
            <span className="icon-editprofile">📚</span>
            <span className="icon-editprofile">🏆</span>
            <span className="icon-editprofile">👥</span>
            <span className="icon-editprofile">✏️</span>
            <span className="icon-editprofile">🧠</span>
            <span className="icon-editprofile">📈</span>
            <span className="icon-editprofile">📊</span>
            <span className="icon-editprofile">🎁</span>
            <span className="icon-editprofile">🌍</span>
            <span className="icon-editprofile">🌟</span>  {/* Star */}
            <span className="icon-editprofile">✅</span>
      </div>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2>Edit Profile</h2>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Save Changes</button>
        {saved && <p className="saved-message">✅ Profile updated successfully!</p>}
      </form>
    </div>
    </div>
  );
};

export default EditProfile;