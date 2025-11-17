import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'player_comparisons',
  timestamps: true,
  underscored: true,
})
export class PlayerComparison extends Model<PlayerComparison> {
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
    type: DataType.STRING,
    allowNull: false,
    field: 'comparison_name',
    comment: 'User-defined name for this comparison',
  })
  comparisonName: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'player_ids',
    comment: 'Array of account_ids being compared',
  })
  playerIds: number[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'comparison_data',
    comment: 'Cached comparison results',
  })
  comparisonData: any;

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

