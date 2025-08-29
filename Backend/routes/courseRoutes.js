const express = require("express");
const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");
const { authenticateToken, validateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply both middleware to all course routes
// First authenticate the token, then validate the user exists
const protect = [authenticateToken, validateUser];

// Course routes - all protected
router.get("/", protect, getAllCourses);
router.get("/:id", protect, getCourseById);
router.post("/", protect, addCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

module.exports = router;
