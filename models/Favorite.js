const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Favorite = sequelize.define('Favorite', {
  favoriteId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'recipes',
      key: 'recipeId',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'userId',
    },
    allowNull: false,
  },
}, {
  tableName: 'favorites',
  timestamps: false,
});

module.exports = Favorite;