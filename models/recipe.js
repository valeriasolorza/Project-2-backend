const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Recipe = sequelize.define('Recipe', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Recipe;

// take the payload that it sends you and ask chatgbpt to create a table model using sequilize that matches this payload 