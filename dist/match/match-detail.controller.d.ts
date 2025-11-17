import { MatchService } from './match.service';
export declare class MatchDetailController {
    private matchService;
    constructor(matchService: MatchService);
    getMatchDetails(matchId: string): Promise<{
        matchDetails: any;
        recommendations: number | number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][];
    }>;
}
