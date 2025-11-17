import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  steamid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileurl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  account_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  mmr: number;
}

