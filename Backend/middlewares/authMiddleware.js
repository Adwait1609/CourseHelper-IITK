const jwt = require("jsonwebtoken");
const db = require("../db/index");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if user exists in database
const validateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const result = await db.query("SELECT id FROM myschema.users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    
    next();
  } catch (error) {
    console.error("User validation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authenticateToken, validateUser };
