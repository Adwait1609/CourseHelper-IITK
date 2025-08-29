import API_BASE_URL from "./apiConfig";
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import CoursesPage from "./CoursesPage";
import ProfilePage from "./ProfilePage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Check if the user is already on the login or signup page
      const path = window.location.pathname;
      if (path === "/" || path === "/login" || path === "/signup") {
        navigate("/courses");
      }
    } else {
      // If no token, redirect to login except on landing, login, or signup pages
      const path = window.location.pathname;
      if (path !== "/" && path !== "/login" && path !== "/signup") {
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;

