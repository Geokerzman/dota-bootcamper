import { MatchService } from './match.service';
export declare class MatchSummaryController {
    private matchService;
    constructor(matchService: MatchService);
    getMatchSummary(matchId: string): Promise<any>;
}
