const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const User = require('./User.js');

const Session = sequelize.define('Session', {
    sessionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    token: {
        type: DataTypes.CHAR(48),
        allowNull: false,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.CHAR(64),
        allowNull: false,
    },
    refreshExpiration: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'sessions',
    timestamps: false,
});

Session.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

module.exports = Session;