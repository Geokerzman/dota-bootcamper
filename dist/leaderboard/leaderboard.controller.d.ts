import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getLeaderboard(): Promise<{
        username: any;
        team: any;
        profileurl: string;
        avatar: any;
    }[]>;
}
