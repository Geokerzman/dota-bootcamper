import { OpenDotaService } from '../services/open-dota.service';
export declare class LeaderboardService {
    private openDotaService;
    private readonly logger;
    constructor(openDotaService: OpenDotaService);
    getLeaderboard(): Promise<{
        username: any;
        team: any;
        profileurl: string;
        avatar: any;
    }[]>;
}
