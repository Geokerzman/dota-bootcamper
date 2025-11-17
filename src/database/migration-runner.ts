import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { up as createPlayerCacheUp, down as createPlayerCacheDown } from '../migrations/001-create-player-cache';

dotenv.config();

const sequelize = new Sequelize({
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

    // Run migrations
    console.log('Running migrations...');
    await createPlayerCacheUp(queryInterface);
    console.log('Migration 001-create-player-cache completed successfully.');

    await sequelize.close();
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

async function rollbackMigrations() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    const queryInterface = sequelize.getQueryInterface();

    // Rollback migrations
    console.log('Rolling back migrations...');
    await createPlayerCacheDown(queryInterface);
    console.log('Migration 001-create-player-cache rolled back successfully.');

    await sequelize.close();
    console.log('Rollback completed successfully.');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
}

// Run migrations if called directly
if (require.main === module) {
  const command = process.argv[2];
  if (command === 'down') {
    rollbackMigrations();
  } else {
    runMigrations();
  }
}

export { runMigrations, rollbackMigrations };

