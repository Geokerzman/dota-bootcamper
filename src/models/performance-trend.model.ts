import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'performance_trends',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'account_id', 'recorded_at'],
    },
  ],
})
export class PerformanceTrend extends Model<PerformanceTrend> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'account_id',
  })
  accountId: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'metrics',
    comment: 'Performance metrics snapshot (win rate, KDA, MMR, etc.)',
  })
  metrics: {
    winRate: number;
    kda: number;
    mmr?: number;
    rankTier?: number;
    matchesPlayed: number;
    avgGpm?: number;
    avgXpm?: number;
  };

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'recorded_at',
    comment: 'When this snapshot was recorded',
  })
  recordedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'updated_at',
  })
  updatedAt: Date;
}

