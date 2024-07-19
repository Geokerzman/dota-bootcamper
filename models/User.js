const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    steamid: {
        type: DataTypes.STRING,
        unique: true,
    },
    profileurl: {
        type: DataTypes.STRING,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    account_id: {
        type: DataTypes.INTEGER,
    },
    mmr: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: true,
});

module.exports = User;
