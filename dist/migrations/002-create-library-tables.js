"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('library', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        item_type: {
            type: sequelize_1.DataTypes.ENUM('player', 'hero', 'match'),
            allowNull: false,
        },
        item_id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        item_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
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
    await queryInterface.addIndex('library', ['user_id', 'item_type', 'item_id'], {
        unique: true,
        name: 'unique_user_item',
    });
    await queryInterface.createTable('player_comparisons', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        comparison_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        player_ids: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        comparison_data: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
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
    await queryInterface.createTable('alerts', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        alert_type: {
            type: sequelize_1.DataTypes.ENUM('player_match', 'player_rank_change', 'match_started', 'custom'),
            allowNull: false,
        },
        alert_name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        target_id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
        },
        conditions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'triggered', 'disabled'),
            allowNull: false,
            defaultValue: 'active',
        },
        last_triggered: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
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
    await queryInterface.createTable('performance_trends', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        account_id: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        metrics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
        },
        recorded_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
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
    await queryInterface.addIndex('performance_trends', ['user_id', 'account_id', 'recorded_at'], {
        name: 'performance_trends_user_account_date',
    });
}
async function down(queryInterface) {
    await queryInterface.dropTable('performance_trends');
    await queryInterface.dropTable('alerts');
    await queryInterface.dropTable('player_comparisons');
    await queryInterface.dropTable('library');
}
//# sourceMappingURL=002-create-library-tables.js.map