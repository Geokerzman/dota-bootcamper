import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'player_cache',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['account_id'],
    },
  ],
})
export class PlayerCache extends Model<PlayerCache> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
    field: 'account_id',
  })
  accountId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'solo_competitive_rank',
  })
  soloCompetitiveRank: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'competitive_rank',
  })
  competitiveRank: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'rank_tier',
  })
  rankTier: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'leaderboard_rank',
  })
  leaderboardRank: number;

  // Profile data stored as JSON
  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'profile_data',
  })
  profileData: {
    account_id: number;
    personaname: string;
    name: string;
    steamid: string;
    avatarmedium: string;
    avatarfull?: string;
    last_login: string;
    profileurl: string;
    plus?: boolean;
    loccountrycode?: string;
  };

  // Additional player stats stored as JSON
  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'win_loss',
  })
  winLoss: {
    win: number;
    lose: number;
  };

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'totals',
  })
  totals: any[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'counts',
  })
  counts: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'heroes',
  })
  heroes: any[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'peers',
  })
  peers: any[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'ratings',
  })
  ratings: any[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'last_updated',
  })
  lastUpdated: Date;

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

