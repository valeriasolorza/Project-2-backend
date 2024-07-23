const axios = require('axios');
const sequelize = require('./config/db');
const Recipe = require('./models/recipe.'); // Adjust the path as needed

async function fetchData() {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    const meal = response.data.meals[0];

    const recipe = {
      recipeId: meal.idMeal,
      recipeName: meal.strMeal,
      categoryId: meal.idCategory || 1, // Use a default value or handle categories appropriately
      instructions: meal.strInstructions,
      pictures: meal.strMealThumb,
      ytLink: meal.strYoutube,
      ingredients: meal.strIngredient1 + ', ' + meal.strIngredient2, // Adjust as needed
      measurements: meal.strMeasure1 + ', ' + meal.strMeasure2 // Adjust as needed
    };

    await Recipe.create(recipe);
    console.log('Recipe saved to database');
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    sequelize.close();
  }
}

fetchData();
