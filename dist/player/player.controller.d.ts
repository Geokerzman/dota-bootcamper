import { PlayerService } from './player.service';
export declare class PlayerController {
    private playerService;
    constructor(playerService: PlayerService);
    getPlayerInfo(accountId: string): Promise<import("../dto/player-info.dto").PlayerInfoDto[]>;
    getTotals(accountId: string, query: any): Promise<any>;
    getCounts(accountId: string, query: any): Promise<any>;
    searchPlayers(query: string): Promise<any>;
    getHistograms(accountId: string, field: string, query: any): Promise<any>;
    getOverview(accountId: string): Promise<{
        profile: any;
        wl: any;
        recentMatches: any;
        heroes: any;
        peers: any;
        totals: any;
        counts: any;
        ratings: any;
    }>;
}
