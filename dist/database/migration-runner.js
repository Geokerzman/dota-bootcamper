"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
exports.rollbackMigrations = rollbackMigrations;
const sequelize_1 = require("sequelize");
const dotenv = __importStar(require("dotenv"));
const _000_create_users_1 = require("../migrations/000-create-users");
const _001_create_player_cache_1 = require("../migrations/001-create-player-cache");
const _002_create_library_tables_1 = require("../migrations/002-create-library-tables");
dotenv.config();
const sequelize = new sequelize_1.Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
});
async function runMigrations() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');
        const queryInterface = sequelize.getQueryInterface();
        console.log('Running migrations...');
        await (0, _000_create_users_1.up)(queryInterface);
        console.log('Migration 000-create-users completed successfully.');
        await (0, _001_create_player_cache_1.up)(queryInterface);
        console.log('Migration 001-create-player-cache completed successfully.');
        await (0, _002_create_library_tables_1.up)(queryInterface);
        console.log('Migration 002-create-library-tables completed successfully.');
        await sequelize.close();
        console.log('Migrations completed successfully.');
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}
async function rollbackMigrations() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');
        const queryInterface = sequelize.getQueryInterface();
        console.log('Rolling back migrations...');
        await (0, _002_create_library_tables_1.down)(queryInterface);
        console.log('Migration 002-create-library-tables rolled back successfully.');
        await (0, _001_create_player_cache_1.down)(queryInterface);
        console.log('Migration 001-create-player-cache rolled back successfully.');
        await (0, _000_create_users_1.down)(queryInterface);
        console.log('Migration 000-create-users rolled back successfully.');
        await sequelize.close();
        console.log('Rollback completed successfully.');
    }
    catch (error) {
        console.error('Rollback failed:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    const command = process.argv[2];
    if (command === 'down') {
        rollbackMigrations();
    }
    else {
        runMigrations();
    }
}
//# sourceMappingURL=migration-runner.js.map