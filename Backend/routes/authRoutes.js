const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Debugging middleware for auth routes
router.use((req, res, next) => {
  console.log(`AuthRoutes: ${req.method} ${req.url}`);
  next();
});

// Public routes
router.post("/signup", registerUser); // User registration route
router.post("/login", loginUser); // User login route

// Protected routes - require authentication
router.get("/profile", authenticateToken, getUserProfile); // Get user profile
router.put("/profile", authenticateToken, updateUserProfile); // Update user profile

module.exports = router;
