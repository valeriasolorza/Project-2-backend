const express = require('express');        // Import Express
const { connectDB } = require('./config/db'); // Import the connectDB function
const recipeRoutes = require('./routes/recipeRoutes'); // Import the recipe routes
require('dotenv').config();               // Load environment variables

const app = express();                    // Create a new Express application

// Connect to the PostgreSQL database
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the recipe routes for any requests to /api
app.use('/api', recipeRoutes);

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the server's running status
});
