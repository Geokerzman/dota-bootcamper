import { LiveService } from './live.service';
export declare class LiveController {
    private liveService;
    constructor(liveService: LiveService);
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
