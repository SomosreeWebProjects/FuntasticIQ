import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/login", user);
            

            if (response.data.success) {
                
                const name = response.data.name;
                localStorage.setItem("username", name);
                localStorage.setItem("email", user.email);
                localStorage.setItem("token", response.data.token); // Save token
                localStorage.setItem("userId", response.data.user._id); // Correct path to userId
                alert("Login Successful!"); // Save both token and username
                // ✅ Delay navigation slightly to ensure localStorage is ready
                setTimeout(() => {
                    navigate("/dashboard");
                }, 100);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Invalid credentials, please try again.");
        }
    };

    return (
        <div className="page-container">
            <div className="floating-icons-login">
            <span className="icon-login">❓</span>
                <span className="icon-login">🎮</span>
                <span className="icon-login">🎯</span>
                <span className="icon-login">💡</span>
                <span className="icon-login">🎊</span>
                <span className="icon-login">🎉</span>
                <span className="icon-login">🏅</span>
                <span className="icon-login">🔥</span>
                <span className="icon-login">🎲</span>
                <span className="icon-login">🧩</span>
                <span className="icon-login">📚</span>
                <span className="icon-login">🏆</span>
                <span className="icon-login">👥</span>
                <span className="icon-login">✏️</span>
                <span className="icon-login">🧠</span>
                <span className="icon-login">📈</span>
                <span className="icon-login">📊</span>
                <span className="icon-login">🎁</span>
                <span className="icon-login">🌍</span>
                <span className="icon-login">🌟</span>  {/* Star */}
                <span className="icon-login">✅</span>
            </div>
        <div className="login-container">
            <div className="login-box">
                <h2>🧑‍🎓 Login 🧑‍🎓</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={user.password}
                    onChange={handleChange}
                    required
                />

                <button onClick={handleSubmit}>Login</button>

                <p>
                    Don't have an account?{" "}
                    <span className="signup-link" onClick={() => navigate("/signup")}>
                        Sign Up
                    </span>
                </p>
            </div>
            </div>
            {/* Add Footer Below */}
            <footer className="footer-login">
                <p>© 2025 FuntasticIQ. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Login;
