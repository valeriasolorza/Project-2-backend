const express = require('express');
const cors = require('cors');
const app = express();
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(cors())

// Middleware
app.use(express.json());

// Routes
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);

module.exports = app;
