const { Pool } = require('pg');       // Import the Pool class from 'pg' to handle PostgreSQL connections
require('dotenv').config();          // Load environment variables from .env file

// Create a new Pool instance with PostgreSQL connection details
const pool = new Pool({
  user: process.env.DB_USER,        // Username for PostgreSQL
  host: process.env.DB_HOST,        // Host of the PostgreSQL server
  database: process.env.DB_NAME,    // Database name
  password: process.env.DB_PASSWORD, // Password for PostgreSQL user
  port: process.env.DB_PORT,        // Port where PostgreSQL is running
});

// Function to connect to the database and handle errors
const connectDB = async () => {
  try {
    await pool.connect();   // Attempt to connect to the PostgreSQL database
    console.log('PostgreSQL connected');  // Log a success message if connection is successful
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message); // Log any connection errors
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = { pool, connectDB }; // Export the pool and connectDB function for use in other files
