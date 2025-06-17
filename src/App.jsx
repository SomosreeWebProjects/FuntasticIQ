import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../client/components/Navbar";
import Home from "../client/pages/home";
import Result from "../client/pages/Result";
import Login from "../client/pages/Login";
import Signup from "../client/pages/Signup";
import Dashboard from "../client/pages/Dashboard";
import Profile from "../client/pages/Profile";
import SelectLevel from "../client/pages/SelectLevel";
import Quiz from "../client/pages/Quiz";
import EditProfile from "../client/pages/EditProfile";
import ChangePassword from "../client/pages/ChangePassword";
import Logout from "../client/pages/Logout";
import ProtectedRoute from "../client/components/ProtectedRoute";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/select-level/:subject" element={<SelectLevel />} />
        <Route path="/quiz/:subject/:difficulty" element={<Quiz />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/logout" element={<Logout />} />


        {/* ✅ All protected routes under one wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
