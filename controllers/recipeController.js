const Recipe = require('../models/Recipe');
const Area = require('../models/Area');
const Category = require('../models/Category');
const sequelize = require('sequelize');
const { validateToken } = require('./accountController');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body;
  try {
    const newRecipe = await Recipe.create({ name, ingredients, instructions });
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  const session = await validateToken(token);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const recipe = await Recipe.findByPk(id,
      {
        attributes: {
          include: [
            [sequelize.literal(`EXISTS(SELECT 1 FROM favorites WHERE favorites."recipeId" = "Recipe"."recipeId" AND favorites."userId" = ${session.userId})`), 'isFavorite']
          ]
        },
        include: [
          {
            model: Area,
            as: 'area',
            attributes: ['areaName'],
          },
          {
            model: Category,
            as: 'category',
          }
        ]
      }
    );
    if (recipe) {
      if (recipe.favorite !== null) {
        recipe.isFavorite = true;
      }
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, instructions } = req.body;
  try {
    const recipe = await Recipe.findByPk(id);
    if (recipe) {
      recipe.name = name;
      recipe.ingredients = ingredients;
      recipe.instructions = instructions;
      await recipe.save();
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSearchRecipes = async (req, res) => {
  const { s } = req.query;
  if (!s || /^\d+$/.test(s)) {
    res.status(400).json({ message: 'Invalid search query' });
    return;
  }
  const search = s.trim().toLowerCase();
  if (!search) {
    res.status(400).json({ message: 'Invalid search query' });
    return;
  }
  try {
    const recipes = await Recipe.findAll({
      where: {
        recipeName: sequelize.where(sequelize.fn('LOWER', sequelize.col('recipeName')), 'LIKE', '%' + search + '%')
      },
      include: [
        {
          model: Area,
          as: 'area',
          attributes: ['areaName'],
        },
        {
          model: Category,
          as: 'category',
        }
      ]
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByPk(id);
    if (recipe) {
      await recipe.destroy();
      res.json({ message: 'Recipe deleted' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRandomRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      order: sequelize.literal('random()'),
      include: [
        {
          model: Area,
          as: 'area',
          attributes: ['areaName'],
        },
        {
          model: Category,
          as: 'category',
        }
      ]
    });
    if (recipe) {
      res.json(recipe.dataValues);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getRecipesByFirstLetter = async (req, res) => {
  const { letter } = req.params;
  if (!letter || /^\d+$/.test(letter) || letter.length > 1) {
    res.status(400).json({ message: 'Invalid letter' });
    return;
  }
  const uppercaseLetter = letter.toUpperCase();
  try {
    const recipes = await Recipe.findAll({
      where: {
        recipeName: sequelize.where(sequelize.fn('UPPER', sequelize.col('recipeName')), 'LIKE', uppercaseLetter + '%'),
      },
      include: [
        {
          model: Area,
          as: 'area',
          attributes: ['areaName'],
        },
        {
          model: Category,
          as: 'category',
        }
      ]
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecipeCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
