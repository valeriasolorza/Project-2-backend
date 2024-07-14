const express = require('express');
const recipeRoutes = require('./routes/recipeRoutes'); // Make sure this path is correct
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Use the recipe routes
app.use('/api/recipes', recipeRoutes);

module.exports = app;
