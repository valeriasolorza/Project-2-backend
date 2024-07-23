const express = require('express');
const app = express();
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);

module.exports = app;
