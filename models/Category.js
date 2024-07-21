const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryThumb: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'categories',
    timestamps: false,
});

module.exports = Category;