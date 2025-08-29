const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/index");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
};

const registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  try {
    // Check if username already exists
    const userExists = await db.query("SELECT * FROM myschema.users WHERE username = $1 OR email = $2", 
      [username, email]);
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        message: userExists.rows[0].username === username 
          ? "Username already exists" 
          : "Email already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      "INSERT INTO myschema.users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email",
      [username, email, hashedPassword, firstName || null, lastName || null]
    );
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email
      }
    });
    
    console.log("User registered:", username);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if user exists with username or email
    const user = await db.query(
      "SELECT * FROM myschema.users WHERE username = $1 OR email = $1", 
      [username]
    );

    if (!user.rows.length) {
      console.error("User not found:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      console.error("Invalid password for user:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userInfo = {
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      firstName: user.rows[0].first_name,
      lastName: user.rows[0].last_name
    };

    const token = generateToken(userInfo);
    
    res.json({ 
      token,
      user: userInfo
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userResult = await db.query(
      "SELECT id, username, email, first_name, last_name, profile_picture, created_at FROM myschema.users WHERE id = $1",
      [userId]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePicture: user.profile_picture,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserProfile = async (req, res) => {
  const { firstName, lastName, email, profilePicture } = req.body;
  const userId = req.user.id;

  try {
    // Check if email is already used by another user
    if (email) {
      const emailCheck = await db.query(
        "SELECT * FROM myschema.users WHERE email = $1 AND id != $2",
        [email, userId]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email already in use by another account" });
      }
    }

    const result = await db.query(
      `UPDATE myschema.users 
       SET first_name = COALESCE($1, first_name), 
           last_name = COALESCE($2, last_name), 
           email = COALESCE($3, email), 
           profile_picture = COALESCE($4, profile_picture),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, username, email, first_name, last_name, profile_picture`,
      [firstName, lastName, email, profilePicture, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePicture: user.profile_picture
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
