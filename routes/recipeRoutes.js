// routes/recipeRoutes.js
const express = require('express'); // Import Express for routing
const router = express.Router(); // Create a new router instance
const {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController'); // Import controller functions

// Define routes and associate them with controller functions
router.get('/recipes', getAllRecipes);       // GET /api/recipes - Retrieve all recipes
router.post('/recipes', createRecipe);       // POST /api/recipes - Create a new recipe
router.get('/recipes/:id', getRecipeById);   // GET /api/recipes/:id - Retrieve a recipe by ID
router.put('/recipes/:id', updateRecipe);    // PUT /api/recipes/:id - Update a recipe by ID
router.delete('/recipes/:id', deleteRecipe); // DELETE /api/recipes/:id - Delete a recipe by ID

module.exports = router; // Export the router for use in the main app
