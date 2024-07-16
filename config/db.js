// Import necessary modules
const fetch = require('node-fetch'); // For making HTTP requests
const { Pool } = require('pg'); // PostgreSQL client
require('dotenv').config(); // Load environment variables

// Function to fetch recipes from an API
const fetchRecipes = async (searchTerm = '') => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error; // Rethrow the error for handling elsewhere if needed
  }
};

// PostgreSQL database connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
    process.exit(1);
  }
};

// Export both the fetchRecipes function and the PostgreSQL pool with connectDB function
module.exports = { fetchRecipes, pool, connectDB };


