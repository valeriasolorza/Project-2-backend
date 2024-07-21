const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Area = sequelize.define('Area', {
    areaId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    areaName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'areas',
    timestamps: false,
});

module.exports = Area;