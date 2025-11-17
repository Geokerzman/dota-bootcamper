"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    const tableExists = await queryInterface.tableExists('player_cache');
    if (tableExists) {
        await queryInterface.dropTable('player_cache');
    }
    await queryInterface.createTable('player_cache', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        account_id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },
        solo_competitive_rank: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        competitive_rank: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        rank_tier: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        leaderboard_rank: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        profile_data: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Stores player profile information from OpenDota API',
        },
        win_loss: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Stores win/loss statistics',
        },
        totals: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Stores player totals statistics',
        },
        counts: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Stores player counts statistics',
        },
        heroes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Stores player heroes statistics',
        },
        peers: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Stores player peers information',
        },
        ratings: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Stores player ratings history',
        },
        last_updated: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Timestamp when the cache was last updated',
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
    await queryInterface.addIndex('player_cache', ['account_id'], {
        unique: true,
        name: 'player_cache_account_id_unique',
    });
    await queryInterface.addIndex('player_cache', ['last_updated'], {
        name: 'player_cache_last_updated_index',
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('player_cache');
}
//# sourceMappingURL=001-create-player-cache.js.map