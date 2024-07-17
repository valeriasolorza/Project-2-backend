const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController'); // Import controller functions

// Recipe API routes
router.get('/recipes', getAllRecipes);
router.post('/recipes', createRecipe);
router.get('/recipes/:id', getRecipeById);
router.put('/recipes/:id', updateRecipe);
router.delete('/recipes/:id', deleteRecipe);

// Additional API routes for external API calls
router.get('/random-meal', async (req, res) => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching random meal:', error.message);
    res.status(500).json({ error: 'Failed to fetch random meal' });
  }
});

router.get('/search-by-ingredient', async (req, res) => {
  const ingredient = req.query.i;
  if (!ingredient) {
    return res.status(400).json({ error: 'Ingredient query parameter is required' });
  }

  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php', {
      params: { i: ingredient }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching meals by ingredient:', error.message);
    res.status(500).json({ error: 'Failed to search meals by ingredient' });
  }
});

module.exports = router;
