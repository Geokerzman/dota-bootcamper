import { MatchService } from './match.service';
export declare class RecentMatchesController {
    private matchService;
    constructor(matchService: MatchService);
    getRecentMatches(): Promise<{
        matchId: any;
        duration: any;
        startTime: any;
        radiantTeam: any;
        direTeam: any;
        radiantWin: any;
        game_mode: any;
        avg_rank_tier: any;
        num_rank_tier: any;
    }[]>;
}
