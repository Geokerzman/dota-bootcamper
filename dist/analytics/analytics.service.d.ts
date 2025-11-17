import { PlayerComparison } from '../models/player-comparison.model';
import { PerformanceTrend } from '../models/performance-trend.model';
import { OpenDotaService } from '../services/open-dota.service';
export declare class AnalyticsService {
    private comparisonModel;
    private trendModel;
    private openDotaService;
    private readonly logger;
    constructor(comparisonModel: typeof PlayerComparison, trendModel: typeof PerformanceTrend, openDotaService: OpenDotaService);
    comparePlayers(accountIds: number[]): Promise<any>;
    saveComparison(userId: number, comparisonName: string, accountIds: number[]): Promise<PlayerComparison>;
    getSavedComparisons(userId: number): Promise<PlayerComparison[]>;
    getHeroRecommendations(accountId: number): Promise<any>;
    getMetaAnalysis(): Promise<any>;
    recordPerformanceTrend(userId: number, accountId: number): Promise<void>;
    getPerformanceTrends(userId: number, accountId: number, days?: number): Promise<PerformanceTrend[]>;
}
