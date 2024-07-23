const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Area = require('./Area.js');
const Category = require('./Category.js');
const Favorite = require('./Favorite.js');

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
    references: {
      model: 'categories',
      key: 'categoryId'
    },
    allowNull: false,
  },
  areaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'areas',
      key: 'areaId'
    },
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ytLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  measurements: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
}, {
  tableName: 'recipes',
  timestamps: false,
});

Recipe.belongsTo(Area, {
  foreignKey: 'areaId',
  as: 'area',
});

Recipe.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

Recipe.hasMany(Favorite, {
  foreignKey: 'recipeId',
  as: 'favorites',
});

module.exports = Recipe;
