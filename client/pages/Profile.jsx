import React, { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import Swal from 'sweetalert2';
import "./Profile.css";
import DashboardNavbar from "../components/DashboardNavbar";

// 🔁 Shuffle utility function
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}

const Profile = () => {
  const username = localStorage.getItem("username") || "Elvie Winlose";
  const [editing, setEditing] = useState(false);
  const [newHandle, setNewHandle] = useState(localStorage.getItem("handle") || "@Rookie123");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "/assets/profile-placeholder.png");

  const [playedQuizzes, setPlayedQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [friends, setFriends] = useState(() => {
    return JSON.parse(localStorage.getItem("friends")) || [];
  });
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState(localStorage.getItem("username") || "");
  const [editEmail, setEditEmail] = useState(localStorage.getItem("email") || "");
  const [editPassword, setEditPassword] = useState("");
  const [user, setUser] = useState(null);  // Add state for the user
  const [feedback, setFeedback] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");



  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("playedQuizzes")) || {};
    setPlayedQuizzes(history[username] || []);
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ No token found. Skipping protected fetches.");
      return;
    }
  
  
    fetch("http://localhost:5000/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        setUser(user);
        setPoints(user.points || 0); // <-- ✅ add this line to sync MongoDB points
        return fetch(`http://localhost:5000/api/world-rank/${user.name}`);
      })
      .then((res) => res.json())
      .then((data) => setWorldRank(data.rank))
      .catch(() => setWorldRank("N/A"));
  
    fetch("http://localhost:5000/api/leaderboard", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Leaderboard is not an array");
        setLeaderboard(data);
  
        const userIndex = data.findIndex(u => u.name === username);
        if (userIndex >= 0 && userIndex < 10) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
  
        const otherNames = data.filter(u => u.name !== username).map(u => u.name);
        setSuggestedFriends(shuffle(otherNames).slice(0, 5));
      })
      .catch(err => {
        console.error("Leaderboard fetch error:", err.message);
        setLeaderboard([]); // prevent map error
      });
  }, [username]);

  useEffect(() => {
    if (!user?.name) return;
  
    const fetchRank = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/world-rank/${user.name}`);
        console.log("World rank response:", res.data);
        setWorldRank(res.data.rank); // ✅ Correct setter
      } catch (err) {
        console.error("Failed to fetch world rank:", err);
        setWorldRank("Error fetching rank"); // ✅ Correct fallback
      }
    };
  
    fetchRank();
  }, [user?.name]);
  
    // 💾 Save friends to localStorage whenever they change
    useEffect(() => {
      localStorage.setItem("friends", JSON.stringify(friends));
    }, [friends]);

  // Calculate stats
  const [worldRank, setWorldRank] = useState("Loading...");
  const [points, setPoints] = useState(0); // ← Pull actual points from MongoDB
  const totalGames = playedQuizzes.length;
  const totalQuestions = playedQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  const totalCorrect = playedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0);
  const totalIncorrect = totalQuestions - totalCorrect;
  const completionRate = totalGames > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const correctRate = totalGames > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const incorrectRate = 100 - correctRate;
  
    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const saveHandle = () => {
    localStorage.setItem("handle", newHandle);
    setEditing(false);
  };

  const submitFeedback = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/submit-feedback", {
        feedback,
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setFeedbackMessage("✅ Thanks for your feedback!");
        setFeedback("");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      setFeedbackMessage("❌ Failed to submit feedback.");
    }
  };  

  return (
    <div className="profile-main">
      <DashboardNavbar />
      {/* Floating icons */}
      <div className="floating-icons-profile">
            <span className="icon-profile">❓</span>
            <span className="icon-profile">🎮</span>
            <span className="icon-profile">🎯</span>
            <span className="icon-profile">💡</span>
            <span className="icon-profile">🎊</span>
            <span className="icon-profile">🎉</span>
            <span className="icon-profile">🏅</span>
            <span className="icon-profile">🔥</span>
            <span className="icon-profile">🎲</span>
            <span className="icon-profile">🧩</span>
            <span className="icon-profile">📚</span>
            <span className="icon-profile">🏆</span>
            <span className="icon-profile">👥</span>
            <span className="icon-profile">✏️</span>
            <span className="icon-profile">🧠</span>
            <span className="icon-profile">📈</span>
            <span className="icon-profile">📊</span>
            <span className="icon-profile">🎁</span>
            <span className="icon-profile">🌍</span>
            <span className="icon-profile">🌟</span>  {/* Star */}
            <span className="icon-profile">✅</span>
      </div>
      <div className="profile-layout">
      <div className="profile-row">
      <div className="profile-top">
        <h1 className="profile-title">Profile</h1>
        <div className="profile-settings" onClick={() => setShowEditModal(true)} title="Edit Profile">⚙️</div>
        <div className="profile-header">
          <label htmlFor="profile-upload">
            <img src={profilePic} alt="Profile" className="profile-avatar" />
          </label>
          <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          />
          <h2>{username}</h2>
          {editing ? (
            <div>
              <input
              type="text"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              className="handle-input"
              />
              <button onClick={saveHandle} className="save-handle-btn">Save</button>
            </div>
            ) : (
            <p className="handle" onClick={() => setEditing(true)} title="Click to edit">{newHandle}</p>
            )}
            </div>


        <div className="stat-grid">
          <div className="stat-card">🏅
            {worldRank === "Loading..." ? (
              <p>Loading rank...</p>
            ) : worldRank.startsWith("Error") ? (
            <p>Error fetching rank!</p>
          ) : (
          <h3>{worldRank}</h3>
          )}
          <p>World Rank</p>
          </div>
          <div className="stat-card">🎮<h3>{totalGames}</h3><p>Games played</p></div>
          <div className="stat-card">⭐<h3>{points}</h3><p>Points total</p></div>
          <div className="stat-card">🔮<h3>{completionRate}%</h3><p>Completion rate</p></div>
          <div className="stat-card">✅<h3>{correctRate}%</h3><p>Correct answers</p></div>
          <div className="stat-card">❌<h3>{incorrectRate}%</h3><p>Incorrect answers</p></div>
        </div>

        <div className="friends-section">
          <h4>Friends ({friends.length})</h4>
          <div className="friends-list">
            {friends.length === 0 ? (
              <p style={{ color: "#777" }}>No friends added yet.</p>
            ) : (
              <p style={{ color: "#333", fontWeight: "bold" }}>
                {friends.join(", ")}
              </p>
            )}
          </div>
          {showSuggestions && suggestedFriends.length > 0 && (
            <div className="suggested-friends">
              <p style={{ marginBottom: "8px" }}>Suggested Friends:</p>
              {suggestedFriends.map((name, index) => (
                <button
                key={index}
                className="friend-btn"
                onClick={() => {
                  if (!friends.includes(name)) {
                    setFriends([...friends, name]);
                  }
                }}
                >
                  ➕ {name}
                </button>
              ))}
              <button
              style={{ marginTop: "10px" }}
              className="find-friends-btn"
              onClick={() => setShowSuggestions(false)}
              >
                Done
              </button>
            </div>
          )}
          <button className="find-friends-btn" 
          onClick={() => {
            const names = leaderboard.filter(u => u.name !== username).map(u => u.name);
            setSuggestedFriends(shuffle(names).slice(0, 5));
            setShowSuggestions(true); // 🟢 Show suggestion box
            }}>Find friends</button>
          </div>
      </div>


      <div className="leaderboard-section">
        <h4>🌍 Top Players</h4>
        <div className="leaderboard-scroll">
        {leaderboard.length === 0 ? (
          <p style={{ color: "#555", padding: "10px" }}>Loading leaderboard...</p>
        ) : (
          leaderboard.map((user, index) => (
          <div
          key={index}
          className={`leaderboard-item ${user.name === username ? "current-user" : ""}`}
          style={{ animationDelay: `${index * 0.1}s` }}
          >
          <span className="rank">
            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
          </span>
          <span className="name">{user.name}</span>
          <span className="pts">{user.points} pts</span>
          </div>
          ))
        )}
        </div>
      </div>
      </div>
      <div className="feedback-corner">
        <h3>🗣️ Feedback Corner</h3>
        <textarea
        rows="4"
        value={feedback}
        placeholder="How was your quiz experience?"
        onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button onClick={submitFeedback}>
          Submit Feedback
        </button>
        {feedbackMessage && <p>{feedbackMessage}</p>}
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            
            <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="Username"
            className="handle-input"
            />
            
            <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Email Address"
            className="handle-input"
            style={{ marginTop: "10px" }}
            />
            
            <input
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            placeholder="New Password"
            className="handle-input"
            style={{ marginTop: "10px" }}
            />
            
            <div className="modal-actions">
            <button
            className="save-handle-btn"
            onClick={async () => {
              try {
                const response = await fetch("http://localhost:5000/api/user/profile", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    name: editUsername,
                    email: editEmail,
                    handle: newHandle,
                    profilePic: profilePic,
                    friends: friends,
                    totalGames: totalGames,
                    totalCorrect: totalCorrect,
                    totalIncorrect: totalIncorrect,
                    completionRate: completionRate,
                  }),
                });
                
                const result = await response.json();
                
                if (response.ok) {
                  // ✅ Now handle password change separately 
                  if (editPassword.trim() !== "") {
                    const passwordChangeResponse = await fetch("http://localhost:5000/api/user/change-password", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                      },
                      body: JSON.stringify({
                        currentPassword: prompt("Enter your current password to confirm:"), // 🛡️ ask current password
                        newPassword: editPassword,
                      }),
                    });
                    
                    const passwordChangeResult = await passwordChangeResponse.json();
                    
                    if (!passwordChangeResponse.ok) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Password Update Failed',
                        text: passwordChangeResult.error || "Something went wrong while changing password.",
                      });
                      return; // ❌ Stop reload if password update fails
                    }
                  }
                  Swal.fire({
                    title: 'Profile Updated!',
                    text: 'Your changes have been saved successfully.',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
                    imageWidth: 120,
                    imageHeight: 120,
                    background: '#ffffff',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'OK',
                    customClass: {
                      popup: 'animated tada'
                    }
                  }).then(() => {
                    // ✅ Save new username/email to localStorage
                    localStorage.setItem("username", editUsername);
                    localStorage.setItem("email", editEmail);
                    setShowEditModal(false);
                    window.location.reload();
                  });               
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: result.error || "Something went wrong.",
                  });
                }
              } catch (error) {
                console.error(error);
                Swal.fire({
                  icon: 'error',
                  title: 'Server Error',
                  text: 'Please try again later.',
                });
              }
            }}
            >
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <footer className="footer-profile">
        <p>© 2025 FuntasticIQ. All rights reserved.</p>
      </footer>
    </div>
  );

};

export default Profile;
