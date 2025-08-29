const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

// For Neon database, use a connection string with sslmode
let poolConfig;
if (process.env.DATABASE_SSL === 'true') {
  // For Neon or other cloud databases requiring SSL
  poolConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT || 5432,
    ssl: {
      rejectUnauthorized: false,
      sslmode: 'require'
    },
    connectionTimeoutMillis: 10000,
  };
} else {
  // For local development without SSL
  poolConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT || 5432,
    connectionTimeoutMillis: 10000,
  };
}

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

// Function to initialize the database schema
const initializeDatabase = async () => {
  try {
    console.log("Initializing database schema...");
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    
    await pool.query(schema);
    console.log("Database schema initialized successfully");
  } catch (error) {
    console.error("Error initializing database schema:", error);
    throw error;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initializeDatabase
};
