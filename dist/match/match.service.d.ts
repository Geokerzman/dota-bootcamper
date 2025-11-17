import { OpenDotaService } from '../services/open-dota.service';
import { User } from '../models/user.model';
export declare class MatchService {
    private userModel;
    private openDotaService;
    private readonly logger;
    constructor(userModel: typeof User, openDotaService: OpenDotaService);
    getMatchHistory(userId: number): Promise<any>;
    getMatchDetails(matchId: string): Promise<{
        matchDetails: any;
        recommendations: number | number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][];
    }>;
    getMatchData(matchId: string): Promise<any>;
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
