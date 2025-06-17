import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/signup", user);

            if (response.data.success) {
                alert("Signup Successful!");
                localStorage.setItem("username", response.data.name); // ✅ store name
                navigate("/login");
            } else {
                alert(response.data.message);
                if (response.data.message === "User already exists") {
                    navigate("/login");
                }
            }
        } catch (error) {
            alert("Signup Failed! Try Again.");
        }
    };

    return (
        <div className="page-container">
            <div className="floating-icons-signup">
            <span className="icon-signup">❓</span>
                <span className="icon-signup">🎮</span>
                <span className="icon-signup">🎯</span>
                <span className="icon-signup">💡</span>
                <span className="icon-signup">🎊</span>
                <span className="icon-signup">🎉</span>
                <span className="icon-signup">🏅</span>
                <span className="icon-signup">🔥</span>
                <span className="icon-signup">🎲</span>
                <span className="icon-signup">🧩</span>
                <span className="icon-signup">📚</span>
                <span className="icon-signup">🏆</span>
                <span className="icon-signup">👥</span>
                <span className="icon-signup">✏️</span>
                <span className="icon-signup">🧠</span>
                <span className="icon-signup">📈</span>
                <span className="icon-signup">📊</span>
                <span className="icon-signup">🎁</span>
                <span className="icon-signup">🌍</span>
                <span className="icon-signup">🌟</span>  {/* Star */}
                <span className="icon-signup">✅</span>
            </div>
            <div className="signup-container">
                <div className="signup-box">
                    <h2>🧑‍🎓 Signup 🧑‍🎓</h2>
                    
                    <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={user.name}
                    onChange={handleChange}
                    required
                    />
                    
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
                    
                    <button onClick={handleSubmit}>Signup</button>
                    
                    <p>
                        Already have an account?{" "}
                        <span className="login-link" onClick={() => navigate("/login")}>
                            Login
                        </span>
                    </p>
                </div>
            </div>
            
            {/* Add Footer Below */}
            <footer className="footer-signup">
                <p>© 2025 FuntasticIQ. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Signup;
