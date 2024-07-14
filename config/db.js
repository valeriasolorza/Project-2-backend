const { Pool } = require('pg'); // Import the Pool class from 'pg'
require('dotenv').config(); // Load environment variables

const pool = new Pool({
  user: process.env.DB_USER, // Ensure these environment variables are correctly set in your .env file
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    await pool.connect(); // Connect to the PostgreSQL database
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = { pool, connectDB };
