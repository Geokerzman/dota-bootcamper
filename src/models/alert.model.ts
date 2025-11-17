import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

export enum AlertType {
  PLAYER_MATCH = 'player_match',
  PLAYER_RANK_CHANGE = 'player_rank_change',
  MATCH_STARTED = 'match_started',
  CUSTOM = 'custom',
}

export enum AlertStatus {
  ACTIVE = 'active',
  TRIGGERED = 'triggered',
  DISABLED = 'disabled',
}

@Table({
  tableName: 'alerts',
  timestamps: true,
  underscored: true,
})
export class Alert extends Model<Alert> {
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
    type: DataType.ENUM(...Object.values(AlertType)),
    allowNull: false,
    field: 'alert_type',
  })
  alertType: AlertType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'alert_name',
  })
  alertName: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'target_id',
    comment: 'account_id for players, match_id for matches',
  })
  targetId: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'conditions',
    comment: 'Alert conditions (e.g., rank threshold, match type)',
  })
  conditions: any;

  @Column({
    type: DataType.ENUM(...Object.values(AlertStatus)),
    allowNull: false,
    defaultValue: AlertStatus.ACTIVE,
    field: 'status',
  })
  status: AlertStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_triggered',
  })
  lastTriggered: Date;

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

