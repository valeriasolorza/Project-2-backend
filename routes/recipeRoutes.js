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

// // Routes for managing recipes
// router.get('/', getAllRecipes);
// router.post('/', createRecipe);
// router.get('/:id', getRecipeById);
// router.put('/:id', updateRecipe);
// router.delete('/:id', deleteRecipe);

// Function to list meals by first letter
const listMealsByFirstLetter = async (letter) => {
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    return response.data;
  } catch (error) {
    console.error('Error listing meals by first letter:', error);
    throw error;
  }
};

// Function to list meal categories
const listMealCategories = async () => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
    return response.data;
  } catch (error) {
    console.error('Error listing meal categories:', error);
    throw error;
  }
};

// Endpoint to fetch a random meal from external API
router.get('/random-meal', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching random meal:', error.message);
    res.status(500).json({ error: 'Failed to fetch random meal' });
  }
});

// Endpoint to list meals by first letter
router.get('/meals-by-letter/:letter', async (req, res) => {
  try {
    const { letter } = req.params;
    const data = await listMealsByFirstLetter(letter);
    res.json(data);
  } catch (error) {
    console.error('Error listing meals by first letter:', error.message);
    res.status(500).json({ error: 'Failed to list meals by first letter' });
  }
});

// Endpoint to list meal categories
router.get('/meal-categories', async (req, res) => {
  try {
    const data = await listMealCategories();
    res.json(data);
  } catch (error) {
    console.error('Error listing meal categories:', error.message);
    res.status(500).json({ error: 'Failed to list meal categories' });
  }
});

router.post("/favorites", async (req, res) => {
  const { userId, recipeId, recipeName, categoryId, instructions, pictures, ytLink, ingredients, measurements } = req.body;

  try {
    // Check if the favorite already exists for the user
    const existingFavorite = await Favorite.findOne({
      where: { userId, recipeId }
    });

    if (existingFavorite) {
      // If favorite exists, remove it (unfavorite)
      await Favorite.destroy({
        where: { userId, recipeId }
      });

      res.json({ message: "Recipe removed from favorites" });
    } else {
      // Check if the recipe exists in the recipes table
      let newRecipeId = recipeId; // Initialize with recipeId from request body
      const existingRecipe = await Recipe.findByPk(recipeId);

      if (!existingRecipe) {
        // Recipe does not exist, insert it into recipes table
        const newRecipe = await Recipe.create({
          recipeId,
          recipeName,
          categoryId,
          instructions,
          pictures,
          ytLink,
          ingredients,
          measurements
        });
        newRecipeId = newRecipe.recipeId;
      }

      // Add to favorites
      await Favorite.create({
        userId,
        recipeId: newRecipeId
      });

      res.json({ message: "Recipe added to favorites" });
    }
  } catch (error) {
    console.error('Error handling favorite:', error.message);
    res.status(500).json({ error: 'Failed to handle favorite' });
  }
});
module.exports = router;
