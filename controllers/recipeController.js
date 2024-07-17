const { pool } = require('../config/db');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body;
  if (!name || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Name, ingredients, and instructions are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO recipes (name, ingredients, instructions) VALUES ($1, $2, $3) RETURNING *',
      [name, ingredients, instructions]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a recipe by ID
exports.getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, instructions } = req.body;
  if (!name || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Name, ingredients, and instructions are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE recipes SET name = $1, ingredients = $2, instructions = $3 WHERE id = $4 RETURNING *',
      [name, ingredients, instructions, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Recipe deleted' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
