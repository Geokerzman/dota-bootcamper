import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    comparePlayers(body: {
        accountIds: number[];
    }): Promise<any>;
    saveComparison(user: any, body: {
        comparisonName: string;
        accountIds: number[];
    }): Promise<import("../models/player-comparison.model").PlayerComparison>;
    getSavedComparisons(user: any): Promise<import("../models/player-comparison.model").PlayerComparison[]>;
    getHeroRecommendations(accountId: string): Promise<any>;
    getMetaAnalysis(): Promise<any>;
    recordPerformanceTrend(user: any, body: {
        accountId: number;
    }): Promise<{
        message: string;
    }>;
    getPerformanceTrends(user: any, accountId: string, days?: string): Promise<import("../models/performance-trend.model").PerformanceTrend[]>;
}
