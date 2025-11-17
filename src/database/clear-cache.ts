import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

async function clearCache() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Clear player cache
    const [results] = await sequelize.query('DELETE FROM player_cache');
    const deletedCount = (results as any).affectedRows || 0;
    
    console.log(`Successfully deleted ${deletedCount} cached player records.`);
    
    await sequelize.close();
    console.log('Cache cleared successfully.');
  } catch (error) {
    console.error('Failed to clear cache:', error);
    process.exit(1);
  }
}

clearCache();

