import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Check if table exists, drop it if it does (for clean migration)
  const tableExists = await queryInterface.tableExists('player_cache');
  if (tableExists) {
    await queryInterface.dropTable('player_cache');
  }
  
  await queryInterface.createTable('player_cache', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    solo_competitive_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    competitive_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rank_tier: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leaderboard_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    profile_data: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores player profile information from OpenDota API',
    },
    win_loss: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores win/loss statistics',
    },
    totals: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores player totals statistics',
    },
    counts: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores player counts statistics',
    },
    heroes: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores player heroes statistics',
    },
    peers: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores player peers information',
    },
    ratings: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Stores player ratings history',
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Timestamp when the cache was last updated',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create index on account_id for faster lookups
  await queryInterface.addIndex('player_cache', ['account_id'], {
    unique: true,
    name: 'player_cache_account_id_unique',
  });

  // Create index on last_updated for cache expiration queries
  await queryInterface.addIndex('player_cache', ['last_updated'], {
    name: 'player_cache_last_updated_index',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('player_cache');
}

