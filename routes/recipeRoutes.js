const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');

router.get('/', getAllRecipes);
router.post('/', createRecipe);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

// Endpoint to fetch a random meal from external API
router.get('/random-meal', async (req, res) => {
  try {
    // Make a request to TheMealDB API for a random meal
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    
    // Send the API response to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error('Error fetching random meal:', error.message);
    res.status(500).json({ error: 'Failed to fetch random meal' });
  }
});

module.exports = router;
