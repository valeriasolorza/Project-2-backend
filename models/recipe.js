const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your Sequelize config file

const Recipe = sequelize.define('Recipe', {
  recipeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  recipeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pictures: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ytLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  measurements: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'recipes',
  timestamps: false,
});

module.exports = Recipe;
