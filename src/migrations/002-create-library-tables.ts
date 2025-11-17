import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create library table
  await queryInterface.createTable('library', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    item_type: {
      type: DataTypes.ENUM('player', 'hero', 'match'),
      allowNull: false,
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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

  await queryInterface.addIndex('library', ['user_id', 'item_type', 'item_id'], {
    unique: true,
    name: 'unique_user_item',
  });

  // Create player_comparisons table
  await queryInterface.createTable('player_comparisons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    comparison_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player_ids: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    comparison_data: {
      type: DataTypes.JSON,
      allowNull: true,
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

  // Create alerts table
  await queryInterface.createTable('alerts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    alert_type: {
      type: DataTypes.ENUM('player_match', 'player_rank_change', 'match_started', 'custom'),
      allowNull: false,
    },
    alert_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    conditions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'triggered', 'disabled'),
      allowNull: false,
      defaultValue: 'active',
    },
    last_triggered: {
      type: DataTypes.DATE,
      allowNull: true,
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

  // Create performance_trends table
  await queryInterface.createTable('performance_trends', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    account_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    metrics: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    recorded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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

  await queryInterface.addIndex('performance_trends', ['user_id', 'account_id', 'recorded_at'], {
    name: 'performance_trends_user_account_date',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('performance_trends');
  await queryInterface.dropTable('alerts');
  await queryInterface.dropTable('player_comparisons');
  await queryInterface.dropTable('library');
}

