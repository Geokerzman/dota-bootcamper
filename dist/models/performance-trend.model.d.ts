import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class PerformanceTrend extends Model<PerformanceTrend> {
    id: number;
    userId: number;
    user: User;
    accountId: number;
    metrics: {
        winRate: number;
        kda: number;
        mmr?: number;
        rankTier?: number;
        matchesPlayed: number;
        avgGpm?: number;
        avgXpm?: number;
    };
    recordedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
