import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class PlayerComparison extends Model<PlayerComparison> {
    id: number;
    userId: number;
    user: User;
    comparisonName: string;
    playerIds: number[];
    comparisonData: any;
    createdAt: Date;
    updatedAt: Date;
}
