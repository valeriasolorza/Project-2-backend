const { pool } = require('../config/db');  // Import the database pool from config

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    // Execute SQL query to fetch all recipes
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows); // Send the results as JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Send error response if query fails
  }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body; // Extract data from request body
  try {
    // Execute SQL query to insert a new recipe
    const result = await pool.query(
      'INSERT INTO recipes (name, ingredients, instructions) VALUES ($1, $2, $3) RETURNING *',
      [name, ingredients, instructions]
    );
    res.status(201).json(result.rows[0]); // Send the created recipe as JSON
  } catch (err) {
    res.status(400).json({ message: err.message }); // Send error response if query fails
  }
};

// Get a recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    // Execute SQL query to fetch a recipe by ID
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send the recipe if found
    } else {
      res.status(404).json({ message: 'Recipe not found' }); // Send error response if recipe not found
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // Send error response if query fails
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body; // Extract data from request body
  try {
    // Execute SQL query to update a recipe by ID
    const result = await pool.query(
      'UPDATE recipes SET name = $1, ingredients = $2, instructions = $3 WHERE id = $4 RETURNING *',
      [name, ingredients, instructions, req.params.id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Send the updated recipe if found
    } else {
      res.status(404).json({ message: 'Recipe not found' }); // Send error response if recipe not found
    }
  } catch (err) {
    res.status(400).json({ message: err.message }); // Send error response if query fails
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    // Execute SQL query to delete a recipe by ID
    const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Recipe deleted' }); // Send success message if recipe was deleted
    } else {
      res.status(404).json({ message: 'Recipe not found' }); // Send error response if recipe not found
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // Send error response if query fails
  }
};
