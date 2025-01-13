const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const coursesRoutes = require("./routes/courseRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Debugging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route setup
console.log("Setting up routes...");
app.use("/api/auth", authRoutes); // Debug: Auth routes
console.log("Auth routes loaded");

app.use("/api/courses", coursesRoutes); // Debug: Courses routes
console.log("Courses routes loaded");

// Wildcard route to catch undefined routes
app.use((req, res) => {
  console.log(`404 Error: Route not found - ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

