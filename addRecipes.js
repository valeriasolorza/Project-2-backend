const axios = require('axios');
const Recipe = require('./models/Recipe');
const Category = require('./models/Category');
const Area = require('./models/Area');

const letters = 'abcdefghijklmnopqrstuvwxyz';

const listMealsByFirstLetter = async (letter) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      return response.data;
    } catch (error) {
      console.error('Error listing meals by first letter:', error);
      throw error;
    }
};

const listMealCategories = async () => {
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        return response.data;
    } catch (error) {
        console.error('Error listing categories:', error);
        throw error;
    }
};

const listMealAreas = async () => {
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        return response.data;
    } catch (error) {
        console.error('Error listing areas:', error);
        throw error;
    }
};

(async () => {
    try {
        const categories_data = await listMealCategories();
        const categories = categories_data.categories;
        if (categories) {
            for (let category of categories) {
                const categoryId = category.idCategory;
                const category_query = await Category.findByPk(categoryId);
                if (category_query) {
                    console.log(`Category ${category.strCategory} already exists`);
                    continue;
                }
                const category_item = {
                    categoryId: categoryId,
                    categoryName: category.strCategory,
                    categoryThumb: category.strCategoryThumb,
                    categoryDescription: category.strCategoryDescription,
                }
                await Category.create(category_item);
                console.log(`Category ${category.strCategory} added to database`);
            }
        }
    } catch (error) {
        console.log('Error listing or inserting categories:', error);
    }
    
    try {
        const areas_data = await listMealAreas();
        const areas = areas_data.meals;
        if (areas) {
            for (let area of areas) {
                const areaName = area.strArea;
                const area_query = await Area.findOne({
                    where: { areaName: areaName }
                });
                if (area_query) {
                    console.log(`Area ${areaName} already exists`);
                    continue;
                }
                const area_item = {
                    areaName: areaName,
                }
                await Area.create(area_item);
                console.log(`Area ${areaName} added to database`);
            }
        } else {
            console.log('No areas found');
        }
    } catch (error) {
        console.log('Error listing or inserting areas:', error);
    }

    for(let letter of letters) {
        try {
            const data = await listMealsByFirstLetter(letter);
            const meals = data.meals;
            if (meals) {
                for (let meal of meals) {
                    const recipeId = meal.idMeal;
                    const recipe_query = await Recipe.findByPk(recipeId);
                    if (recipe_query) {
                        console.log(`Recipe ${meal.strMeal} already exists`);
                        continue;
                    }
                    const category = await Category.findOne({
                        where: { categoryName: meal.strCategory }
                    });
                    if (!category) {
                        console.log(`Category ${meal.strCategory} not found`);
                        continue;
                    }
                    const area = await Area.findOne({
                        where: { areaName: meal.strArea }
                    });
                    if (!area) {
                        console.log(`Area ${meal.strArea} not found`);
                        continue;
                    }
                    var ingredients = [meal.strIngredient1, meal.strIngredient2, meal.strIngredient3, meal.strIngredient4, meal.strIngredient5,
                        meal.strIngredient6, meal.strIngredient7, meal.strIngredient8, meal.strIngredient9, meal.strIngredient10,
                        meal.strIngredient11, meal.strIngredient12, meal.strIngredient13, meal.strIngredient14, meal.strIngredient15,
                        meal.strIngredient16, meal.strIngredient17, meal.strIngredient18, meal.strIngredient19, meal.strIngredient20];
                    ingredients = ingredients.filter(ingredient => ingredient !== null && ingredient.trim() !== '');
                    var measurements = [meal.strMeasure1, meal.strMeasure2, meal.strMeasure3, meal.strMeasure4, meal.strMeasure5,
                        meal.strMeasure6, meal.strMeasure7, meal.strMeasure8, meal.strMeasure9, meal.strMeasure10,
                        meal.strMeasure11, meal.strMeasure12, meal.strMeasure13, meal.strMeasure14, meal.strMeasure15,
                        meal.strMeasure16, meal.strMeasure17, meal.strMeasure18, meal.strMeasure19, meal.strMeasure20];
                    measurements = measurements.filter(measurement => measurement !== null && measurement.trim() !== '');
                    const recipe = {
                        recipeId: recipeId,
                        recipeName: meal.strMeal,
                        categoryId: category.categoryId,
                        areaId: area.areaId,
                        instructions: meal.strInstructions,
                        picture: meal.strMealThumb,
                        ytLink: meal.strYoutube,
                        ingredients: ingredients,
                        measurements: measurements,
                    };
                    await Recipe.create(recipe);
                    console.log(`Recipe ${meal.strMeal} added to database`);
                }
                console.log(`Meals for letter ${letter} added to database`);
            } else {
                console.log(`No meals found for letter ${letter}`);
            }
        } catch (error) {
            console.log(`Error listing or inserting meals by first letter ${letter}:`, error);
        }
    }
})();
