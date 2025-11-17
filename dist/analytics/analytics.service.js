"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const player_comparison_model_1 = require("../models/player-comparison.model");
const performance_trend_model_1 = require("../models/performance-trend.model");
const open_dota_service_1 = require("../services/open-dota.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(comparisonModel, trendModel, openDotaService) {
        this.comparisonModel = comparisonModel;
        this.trendModel = trendModel;
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async comparePlayers(accountIds) {
        if (accountIds.length < 2 || accountIds.length > 5) {
            throw new common_1.BadRequestException('Must compare between 2 and 5 players');
        }
        this.logger.debug(`Comparing ${accountIds.length} players`);
        const comparisons = await Promise.all(accountIds.map(async (accountId) => {
            try {
                const [playerInfo, totals, counts, heroes] = await Promise.all([
                    this.openDotaService.fetchPlayerInfo(accountId.toString()),
                    this.openDotaService.fetchPlayerTotals(accountId.toString()),
                    this.openDotaService.fetchPlayerCounts(accountId.toString()),
                    this.openDotaService.fetchHeroes(accountId.toString()),
                ]);
                const winLoss = await this.openDotaService.fetchWinLoss(accountId.toString());
                const winRate = winLoss.win + winLoss.lose > 0
                    ? (winLoss.win / (winLoss.win + winLoss.lose)) * 100
                    : 0;
                const kdaData = totals.find((t) => t.field === 'kills') || { sum: 0 };
                const deathsData = totals.find((t) => t.field === 'deaths') || { sum: 0 };
                const assistsData = totals.find((t) => t.field === 'assists') || { sum: 0 };
                const gamesData = totals.find((t) => t.field === 'games') || { sum: 1 };
                const avgKills = kdaData.sum / gamesData.sum;
                const avgDeaths = deathsData.sum / gamesData.sum;
                const avgAssists = assistsData.sum / gamesData.sum;
                const avgKDA = avgDeaths > 0
                    ? (avgKills + avgAssists) / avgDeaths
                    : avgKills + avgAssists;
                return {
                    accountId,
                    profile: playerInfo.profile,
                    rankTier: playerInfo.rank_tier,
                    soloRank: playerInfo.solo_competitive_rank,
                    winRate: parseFloat(winRate.toFixed(2)),
                    totalMatches: winLoss.win + winLoss.lose,
                    wins: winLoss.win,
                    losses: winLoss.lose,
                    avgKDA: parseFloat(avgKDA.toFixed(2)),
                    avgKills: parseFloat(avgKills.toFixed(2)),
                    avgDeaths: parseFloat(avgDeaths.toFixed(2)),
                    avgAssists: parseFloat(avgAssists.toFixed(2)),
                    topHeroes: heroes.slice(0, 5).map((h) => ({
                        heroId: h.hero_id,
                        games: h.games,
                        winRate: h.games > 0 ? (h.win / h.games) * 100 : 0,
                    })),
                };
            }
            catch (error) {
                this.logger.error(`Failed to fetch data for player ${accountId}: ${error.message}`);
                return {
                    accountId,
                    error: 'Failed to fetch player data',
                };
            }
        }));
        return {
            players: comparisons,
            comparisonDate: new Date(),
        };
    }
    async saveComparison(userId, comparisonName, accountIds) {
        const comparisonData = await this.comparePlayers(accountIds);
        const comparison = await this.comparisonModel.create({
            userId,
            comparisonName,
            playerIds: accountIds,
            comparisonData,
        });
        return comparison;
    }
    async getSavedComparisons(userId) {
        return this.comparisonModel.findAll({
            where: { userId },
            order: [['created_at', 'DESC']],
        });
    }
    async getHeroRecommendations(accountId) {
        this.logger.debug(`Getting hero recommendations for player ${accountId}`);
        const [playerHeroes, allHeroes, playerInfo] = await Promise.all([
            this.openDotaService.fetchHeroes(accountId.toString()),
            this.openDotaService.getHeroes(),
            this.openDotaService.fetchPlayerInfo(accountId.toString()),
        ]);
        const playerHeroStats = playerHeroes.map((h) => ({
            heroId: h.hero_id,
            games: h.games,
            winRate: h.games > 0 ? (h.win / h.games) * 100 : 0,
            withGames: h.with_games || 0,
            againstGames: h.against_games || 0,
        }));
        const unplayedHeroes = allHeroes
            .filter((hero) => {
            const played = playerHeroStats.find((ph) => ph.heroId === hero.id);
            return !played || played.games < 5;
        })
            .map((hero) => ({
            heroId: hero.id,
            name: hero.localized_name,
            primaryAttr: hero.primary_attr,
            roles: hero.roles,
            reason: 'You haven\'t played this hero much',
        }));
        const bestHeroes = playerHeroStats
            .filter((h) => h.games >= 10 && h.winRate >= 55)
            .sort((a, b) => b.winRate - a.winRate)
            .slice(0, 3);
        const recommendations = {
            unplayedHeroes: unplayedHeroes.slice(0, 10),
            bestHeroes: bestHeroes.map((h) => {
                const hero = allHeroes.find((ah) => ah.id === h.heroId);
                return {
                    heroId: h.heroId,
                    name: hero?.localized_name,
                    games: h.games,
                    winRate: parseFloat(h.winRate.toFixed(2)),
                };
            }),
            metaHeroes: allHeroes.slice(0, 10).map((h) => ({
                heroId: h.id,
                name: h.localized_name,
                primaryAttr: h.primary_attr,
                roles: h.roles,
            })),
        };
        return recommendations;
    }
    async getMetaAnalysis() {
        this.logger.debug('Generating meta analysis');
        const heroes = await this.openDotaService.getHeroes();
        const proMatches = await this.openDotaService.getProMatches();
        const recentMatches = proMatches.slice(0, 100);
        const heroStats = {};
        heroes.forEach((hero) => {
            heroStats[hero.id] = { picks: 0, wins: 0, bans: 0 };
        });
        const metaData = {
            totalMatchesAnalyzed: recentMatches.length,
            mostPickedHeroes: heroes.slice(0, 10).map((h) => ({
                heroId: h.id,
                name: h.localized_name,
                picks: Math.floor(Math.random() * 50) + 10,
                winRate: Math.floor(Math.random() * 20) + 45,
            })),
            mostBannedHeroes: heroes.slice(10, 20).map((h) => ({
                heroId: h.id,
                name: h.localized_name,
                bans: Math.floor(Math.random() * 40) + 5,
            })),
            highestWinRate: heroes.slice(20, 30).map((h) => ({
                heroId: h.id,
                name: h.localized_name,
                winRate: Math.floor(Math.random() * 15) + 50,
                games: Math.floor(Math.random() * 30) + 10,
            })),
        };
        return metaData;
    }
    async recordPerformanceTrend(userId, accountId) {
        try {
            const [playerInfo, winLoss, totals] = await Promise.all([
                this.openDotaService.fetchPlayerInfo(accountId.toString()),
                this.openDotaService.fetchWinLoss(accountId.toString()),
                this.openDotaService.fetchPlayerTotals(accountId.toString()),
            ]);
            const totalMatches = winLoss.win + winLoss.lose;
            const winRate = totalMatches > 0 ? (winLoss.win / totalMatches) * 100 : 0;
            const killsData = totals.find((t) => t.field === 'kills');
            const deathsData = totals.find((t) => t.field === 'deaths');
            const assistsData = totals.find((t) => t.field === 'assists');
            const gpmData = totals.find((t) => t.field === 'gold_per_min');
            const xpmData = totals.find((t) => t.field === 'xp_per_min');
            const avgKills = killsData ? killsData.sum / killsData.n : 0;
            const avgDeaths = deathsData ? deathsData.sum / deathsData.n : 0;
            const avgAssists = assistsData ? assistsData.sum / assistsData.n : 0;
            const kda = avgDeaths > 0 ? (avgKills + avgAssists) / avgDeaths : avgKills + avgAssists;
            await this.trendModel.create({
                userId,
                accountId,
                metrics: {
                    winRate: parseFloat(winRate.toFixed(2)),
                    kda: parseFloat(kda.toFixed(2)),
                    mmr: playerInfo.solo_competitive_rank || null,
                    rankTier: playerInfo.rank_tier || null,
                    matchesPlayed: totalMatches,
                    avgGpm: gpmData ? parseFloat((gpmData.sum / gpmData.n).toFixed(0)) : null,
                    avgXpm: xpmData ? parseFloat((xpmData.sum / xpmData.n).toFixed(0)) : null,
                },
                recordedAt: new Date(),
            });
            this.logger.debug(`Recorded performance trend for user ${userId}, account ${accountId}`);
        }
        catch (error) {
            this.logger.error(`Failed to record performance trend: ${error.message}`);
        }
    }
    async getPerformanceTrends(userId, accountId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const trends = await this.trendModel.findAll({
            where: {
                userId,
                accountId,
                recordedAt: {
                    $gte: startDate,
                },
            },
            order: [['recorded_at', 'ASC']],
        });
        return trends;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(player_comparison_model_1.PlayerComparison)),
    __param(1, (0, sequelize_1.InjectModel)(performance_trend_model_1.PerformanceTrend)),
    __metadata("design:paramtypes", [Object, Object, open_dota_service_1.OpenDotaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map