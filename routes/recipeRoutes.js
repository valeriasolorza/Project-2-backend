const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

const {
  getRandomRecipe,
  getAllRecipes,
  getRecipesByFirstLetter,
  getRecipeCategories,
  getSearchRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

// Endpoint to fetch a random meal from external API
router.get('/random-recipe', getRandomRecipe);

// Endpoint to list meal categories
router.get('/recipe-categories', getRecipeCategories);

router.get('/search-recipes', getSearchRecipes);

router.get('/recipes-by-letter', getRecipesByFirstLetter);

// Routes for managing recipes
router.get('/', getAllRecipes);
router.post('/', createRecipe);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);


// Endpoint to list meals by first letter
router.get('/recipes-by-letter/:letter', getRecipesByFirstLetter);

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
