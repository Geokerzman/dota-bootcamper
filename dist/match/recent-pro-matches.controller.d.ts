import { MatchService } from './match.service';
export declare class RecentProMatchesController {
    private matchService;
    constructor(matchService: MatchService);
    getRecentProMatches(): Promise<{
        matchId: any;
        duration: any;
        startTime: any;
        radiantTeam: any;
        direTeam: any;
        league: any;
        radiantScore: any;
        direScore: any;
        radiantWin: any;
    }[]>;
}
