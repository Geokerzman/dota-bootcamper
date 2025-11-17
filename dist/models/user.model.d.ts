import { Model } from 'sequelize-typescript';
export declare class User extends Model<User> {
    id: number;
    username: string;
    email: string;
    password: string;
    steamid: string;
    profileurl: string;
    avatar: string;
    account_id: number;
    mmr: number;
}
