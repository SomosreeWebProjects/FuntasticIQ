import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account permanently?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/delete", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.clear();
        alert("Your account has been deleted.");
        navigate("/login");
      } else {
        alert(data.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Account deletion error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Account Settings</h2>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#555",
          color: "white",
          padding: "10px 20px",
          border: "none",
          marginRight: "20px",
          cursor: "pointer",
          borderRadius: "6px"
        }}
      >
        Log Out
      </button>
      <button
        onClick={handleDeleteAccount}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          borderRadius: "6px"
        }}
      >
        Delete My Account
      </button>
    </div>
  );
};

export default Logout;
