import { Model } from 'sequelize-typescript';
export declare class PlayerCache extends Model<PlayerCache> {
    id: number;
    accountId: number;
    soloCompetitiveRank: number;
    competitiveRank: number;
    rankTier: number;
    leaderboardRank: number;
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
    winLoss: {
        win: number;
        lose: number;
    };
    totals: any[];
    counts: any;
    heroes: any[];
    peers: any[];
    ratings: any[];
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
}
