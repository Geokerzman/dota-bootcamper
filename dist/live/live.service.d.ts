import { OpenDotaService } from '../services/open-dota.service';
export declare class LiveService {
    private openDotaService;
    private readonly logger;
    private heroCache;
    private playerCache;
    constructor(openDotaService: OpenDotaService);
    private getHeroes;
    private getPlayerProfile;
    getLiveGames(): Promise<{
        match_id: any;
        spectators: any;
        radiant_team: any;
        dire_team: any;
        radiant_score: any;
        dire_score: any;
        players: {
            account_id: any;
            name: any;
            hero_name: any;
            hero_id: any;
            team: string;
            kills: any;
            deaths: any;
            assists: any;
            is_pro: any;
            team_name: any;
            avatar: any;
            rank: string;
        }[];
    }[]>;
}
