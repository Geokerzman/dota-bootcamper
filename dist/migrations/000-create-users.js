"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('Users', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        steamid: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        profileurl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        avatar: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        account_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        mmr: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('Users');
}
//# sourceMappingURL=000-create-users.js.map