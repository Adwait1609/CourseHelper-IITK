const db = require("../db/index");

// Get all courses for the current user
const getAllCourses = async (req, res) => {
  try {
    // Filter courses by user_id from the JWT token
    const userId = req.user.id;
    const result = await db.query(
      `SELECT * FROM myschema.courses 
       WHERE user_id = $1
       ORDER BY created_at DESC`, 
      [userId]
    );
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const result = await db.query(
      `SELECT * FROM myschema.courses 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching course:", err.message);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// Add a new course
const addCourse = async (req, res) => {
  const { name, code, description, credit, image } = req.body;
  const userId = req.user.id;
  
  // Validate required fields
  if (!name || !code) {
    return res.status(400).json({ error: "Course name and code are required" });
  }
  
  try {
    const result = await db.query(
      `INSERT INTO myschema.courses 
        (name, code, description, credit, image, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, code, description, credit, image, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding course:", err.message);
    res.status(500).json({ error: "Failed to add course" });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, code, description, credit, image } = req.body;
  const userId = req.user.id;
  
  // Validate required fields
  if (!name || !code) {
    return res.status(400).json({ error: "Course name and code are required" });
  }
  
  try {
    // First check if the course belongs to the user
    const courseCheck = await db.query(
      `SELECT * FROM myschema.courses 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ 
        error: "Course not found or you don't have permission to modify it" 
      });
    }
    
    const result = await db.query(
      `UPDATE myschema.courses 
       SET name = $1, 
           code = $2, 
           description = $3, 
           credit = $4, 
           image = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      [name, code, description, credit, image, id, userId]
    );
    
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating course:", err.message);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // First check if the course belongs to the user
    const courseCheck = await db.query(
      `SELECT * FROM myschema.courses 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    
    if (courseCheck.rows.length === 0) {
      return res.status(404).json({ 
        error: "Course not found or you don't have permission to delete it" 
      });
    }
    
    await db.query(
      `DELETE FROM myschema.courses 
       WHERE id = $1 AND user_id = $2`, 
      [id, userId]
    );
    
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err.message);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

module.exports = { 
  getAllCourses, 
  getCourseById, 
  addCourse, 
  updateCourse, 
  deleteCourse 
};
