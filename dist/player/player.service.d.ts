import { OpenDotaService } from '../services/open-dota.service';
import { PlayerCache } from '../models/player-cache.model';
import { PlayerInfoDto } from '../dto/player-info.dto';
export declare class PlayerService {
    private playerCacheModel;
    private openDotaService;
    private readonly logger;
    constructor(playerCacheModel: typeof PlayerCache, openDotaService: OpenDotaService);
    getPlayerInfo(accountId: string): Promise<PlayerInfoDto[]>;
    private savePlayerToDatabase;
    private formatPlayerInfo;
    private formatPlayerInfoFromCache;
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
