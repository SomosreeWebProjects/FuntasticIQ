// ForgotPassword.jsx
import React from "react";

const ForgotPassword = () => (
  <div className="forgot-password-container">
    <h2>Forgot Password</h2>
    <form>
      <input type="email" placeholder="Enter your email" required />
      <button type="submit">Reset Password</button>
    </form>
  </div>
);

export default ForgotPassword;