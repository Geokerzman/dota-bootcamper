export declare class OpenDotaService {
    private readonly logger;
    isCacheValid(lastUpdated: Date): boolean;
    private handleApiError;
    fetchPlayerInfo(accountId: string): Promise<any>;
    fetchPlayerTotals(accountId: string, queryParams?: any): Promise<any>;
    fetchPlayerCounts(accountId: string, queryParams?: any): Promise<any>;
    searchPlayers(query: string): Promise<any>;
    fetchHistogram(accountId: string, field: string, queryParams?: any): Promise<any>;
    fetchWinLoss(accountId: string): Promise<any>;
    fetchRecentMatches(accountId: string, limit?: number): Promise<any>;
    fetchHeroes(accountId: string): Promise<any>;
    fetchPeers(accountId: string): Promise<any>;
    fetchRatings(accountId: string): Promise<any>;
    fetchOverview(accountId: string): Promise<{
        profile: any;
        wl: any;
        recentMatches: any;
        heroes: any;
        peers: any;
        totals: any;
        counts: any;
        ratings: any;
    }>;
    getPlayerSummaries(accountId: string): Promise<any>;
    getMatchHistory(accountId: string): Promise<any>;
    getMatchDetail(matchId: string): Promise<any>;
    getMatchData(matchId: string): Promise<any>;
    getHeroes(): Promise<any>;
    getLiveGames(): Promise<any>;
    getProPlayers(): Promise<any>;
    getPublicMatches(): Promise<any>;
    getProMatches(): Promise<any>;
}
