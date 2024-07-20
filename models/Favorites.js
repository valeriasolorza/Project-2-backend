const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your Sequelize config file

const Favorite = sequelize.define('Favorite', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'favorites',
  timestamps: false,
});

module.exports = Favorite;