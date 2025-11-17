import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

export enum LibraryItemType {
  PLAYER = 'player',
  HERO = 'hero',
  MATCH = 'match',
}

@Table({
  tableName: 'library',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      name: 'unique_user_item',
      fields: ['user_id', 'item_type', 'item_id'],
    },
  ],
})
export class Library extends Model<Library> {
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
    type: DataType.ENUM(...Object.values(LibraryItemType)),
    allowNull: false,
    field: 'item_type',
  })
  itemType: LibraryItemType;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'item_id',
    comment: 'account_id for players, hero_id for heroes, match_id for matches',
  })
  itemId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'item_name',
    comment: 'Cached name for quick display (player name, hero name, match title)',
  })
  itemName: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'metadata',
    comment: 'Additional metadata (player rank, hero stats, match details)',
  })
  metadata: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
    comment: 'User notes about this item',
  })
  notes: string;

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

