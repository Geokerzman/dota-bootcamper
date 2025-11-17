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
var PlayerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const open_dota_service_1 = require("../services/open-dota.service");
const player_cache_model_1 = require("../models/player-cache.model");
let PlayerService = PlayerService_1 = class PlayerService {
    constructor(playerCacheModel, openDotaService) {
        this.playerCacheModel = playerCacheModel;
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(PlayerService_1.name);
    }
    async getPlayerInfo(accountId) {
        const accountIdNum = parseInt(accountId, 10);
        if (isNaN(accountIdNum)) {
            throw new common_1.NotFoundException('Invalid account ID');
        }
        const cachedPlayer = await this.playerCacheModel.findOne({
            where: { accountId: accountIdNum },
        });
        if (cachedPlayer && this.openDotaService.isCacheValid(cachedPlayer.lastUpdated)) {
            this.logger.debug(`Using cached data for account_id: ${accountId}`);
            return this.formatPlayerInfoFromCache(cachedPlayer);
        }
        if (!cachedPlayer) {
            this.logger.debug(`Player not found in DB, fetching from API for account_id: ${accountId}`);
        }
        else {
            this.logger.debug(`Cache expired, fetching fresh data from API for account_id: ${accountId}`);
        }
        const apiData = await this.openDotaService.fetchPlayerInfo(accountId);
        if (!apiData || !apiData.profile) {
            throw new common_1.NotFoundException('Player not found or profile is private');
        }
        await this.savePlayerToDatabase(accountIdNum, apiData);
        this.logger.debug(`Player data saved to database for account_id: ${accountId}`);
        return this.formatPlayerInfo(apiData);
    }
    async savePlayerToDatabase(accountId, apiData) {
        try {
            const [wl, totals, counts, heroes, peers, ratings] = await Promise.allSettled([
                this.openDotaService.fetchWinLoss(accountId.toString()),
                this.openDotaService.fetchPlayerTotals(accountId.toString()),
                this.openDotaService.fetchPlayerCounts(accountId.toString()),
                this.openDotaService.fetchHeroes(accountId.toString()),
                this.openDotaService.fetchPeers(accountId.toString()),
                this.openDotaService.fetchRatings(accountId.toString()),
            ]);
            const playerData = {
                accountId,
                soloCompetitiveRank: apiData.solo_competitive_rank ?? null,
                competitiveRank: apiData.competitive_rank ?? null,
                rankTier: apiData.rank_tier ?? null,
                leaderboardRank: apiData.leaderboard_rank ?? null,
                profileData: apiData.profile || null,
                winLoss: wl.status === 'fulfilled' ? wl.value : null,
                totals: totals.status === 'fulfilled' ? totals.value : null,
                counts: counts.status === 'fulfilled' ? counts.value : null,
                heroes: heroes.status === 'fulfilled' ? heroes.value : null,
                peers: peers.status === 'fulfilled' ? peers.value : null,
                ratings: ratings.status === 'fulfilled' ? ratings.value : null,
                lastUpdated: new Date(),
            };
            const [player, created] = await this.playerCacheModel.upsert(playerData, {
                returning: true,
            });
            if (created) {
                this.logger.debug(`New player record created in database for account_id: ${accountId}`);
            }
            else {
                this.logger.debug(`Player record updated in database for account_id: ${accountId}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to save player to database for account_id ${accountId}: ${error.message}`);
        }
    }
    formatPlayerInfo(apiData) {
        const profile = apiData.profile || {};
        const playerInfo = {
            solo_competitive_rank: apiData.solo_competitive_rank ?? null,
            competitive_rank: apiData.competitive_rank ?? null,
            rank_tier: apiData.rank_tier ?? null,
            leaderboard_rank: apiData.leaderboard_rank ?? null,
            profile: {
                account_id: profile.account_id ?? null,
                personaname: profile.personaname ?? null,
                name: profile.name ?? null,
                steamid: profile.steamid ?? null,
                avatarmedium: profile.avatarmedium ?? null,
                last_login: profile.last_login ?? null,
                profileurl: profile.profileurl ?? null,
            },
        };
        return [playerInfo];
    }
    formatPlayerInfoFromCache(cachedPlayer) {
        const profile = cachedPlayer.profileData || {};
        const playerInfo = {
            solo_competitive_rank: cachedPlayer.soloCompetitiveRank ?? null,
            competitive_rank: cachedPlayer.competitiveRank ?? null,
            rank_tier: cachedPlayer.rankTier ?? null,
            leaderboard_rank: cachedPlayer.leaderboardRank ?? null,
            profile: {
                account_id: profile.account_id ?? null,
                personaname: profile.personaname ?? null,
                name: profile.name ?? null,
                steamid: profile.steamid ?? null,
                avatarmedium: profile.avatarmedium ?? null,
                last_login: profile.last_login ?? null,
                profileurl: profile.profileurl ?? null,
            },
        };
        return [playerInfo];
    }
    async getTotals(accountId, query) {
        const accountIdNum = parseInt(accountId, 10);
        if (isNaN(accountIdNum)) {
            throw new common_1.NotFoundException('Invalid account ID');
        }
        let cachedPlayer = await this.playerCacheModel.findOne({
            where: { accountId: accountIdNum },
        });
        if (!cachedPlayer) {
            this.logger.debug(`Player not in DB, fetching basic info for account_id: ${accountId}`);
            const apiData = await this.openDotaService.fetchPlayerInfo(accountId);
            if (apiData && apiData.profile) {
                await this.savePlayerToDatabase(accountIdNum, apiData);
                cachedPlayer = await this.playerCacheModel.findOne({
                    where: { accountId: accountIdNum },
                });
            }
        }
        if (cachedPlayer &&
            this.openDotaService.isCacheValid(cachedPlayer.lastUpdated) &&
            cachedPlayer.totals) {
            this.logger.debug(`Using cached totals for account_id: ${accountId}`);
            return cachedPlayer.totals;
        }
        this.logger.debug(`Fetching fresh totals from API for account_id: ${accountId}`);
        const totals = await this.openDotaService.fetchPlayerTotals(accountId, query);
        if (cachedPlayer) {
            await cachedPlayer.update({ totals, lastUpdated: new Date() });
            this.logger.debug(`Totals updated in database for account_id: ${accountId}`);
        }
        return totals;
    }
    async getCounts(accountId, query) {
        const accountIdNum = parseInt(accountId, 10);
        if (isNaN(accountIdNum)) {
            throw new common_1.NotFoundException('Invalid account ID');
        }
        let cachedPlayer = await this.playerCacheModel.findOne({
            where: { accountId: accountIdNum },
        });
        if (!cachedPlayer) {
            this.logger.debug(`Player not in DB, fetching basic info for account_id: ${accountId}`);
            const apiData = await this.openDotaService.fetchPlayerInfo(accountId);
            if (apiData && apiData.profile) {
                await this.savePlayerToDatabase(accountIdNum, apiData);
                cachedPlayer = await this.playerCacheModel.findOne({
                    where: { accountId: accountIdNum },
                });
            }
        }
        if (cachedPlayer &&
            this.openDotaService.isCacheValid(cachedPlayer.lastUpdated) &&
            cachedPlayer.counts) {
            this.logger.debug(`Using cached counts for account_id: ${accountId}`);
            return cachedPlayer.counts;
        }
        this.logger.debug(`Fetching fresh counts from API for account_id: ${accountId}`);
        const counts = await this.openDotaService.fetchPlayerCounts(accountId, query);
        if (cachedPlayer) {
            await cachedPlayer.update({ counts, lastUpdated: new Date() });
            this.logger.debug(`Counts updated in database for account_id: ${accountId}`);
        }
        return counts;
    }
    async searchPlayers(query) {
        const players = await this.openDotaService.searchPlayers(query);
        return players;
    }
    async getHistograms(accountId, field, query) {
        const histograms = await this.openDotaService.fetchHistogram(accountId, field, query);
        return histograms;
    }
    async getOverview(accountId) {
        const accountIdNum = parseInt(accountId, 10);
        if (isNaN(accountIdNum)) {
            throw new common_1.NotFoundException('Invalid account ID');
        }
        const cachedPlayer = await this.playerCacheModel.findOne({
            where: { accountId: accountIdNum },
        });
        if (cachedPlayer &&
            this.openDotaService.isCacheValid(cachedPlayer.lastUpdated) &&
            cachedPlayer.profileData &&
            cachedPlayer.winLoss &&
            cachedPlayer.heroes &&
            cachedPlayer.peers &&
            cachedPlayer.totals &&
            cachedPlayer.counts &&
            cachedPlayer.ratings) {
            this.logger.debug(`Using cached overview for account_id: ${accountId}`);
            return {
                profile: { profile: cachedPlayer.profileData, ...cachedPlayer },
                wl: cachedPlayer.winLoss,
                recentMatches: [],
                heroes: cachedPlayer.heroes,
                peers: cachedPlayer.peers,
                totals: cachedPlayer.totals,
                counts: cachedPlayer.counts,
                ratings: cachedPlayer.ratings,
            };
        }
        if (!cachedPlayer) {
            this.logger.debug(`Player not in DB, fetching overview from API for account_id: ${accountId}`);
        }
        else {
            this.logger.debug(`Cache expired, fetching fresh overview from API for account_id: ${accountId}`);
        }
        const data = await this.openDotaService.fetchOverview(accountId);
        await this.savePlayerToDatabase(accountIdNum, data.profile);
        return data;
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = PlayerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(player_cache_model_1.PlayerCache)),
    __metadata("design:paramtypes", [Object, open_dota_service_1.OpenDotaService])
], PlayerService);
//# sourceMappingURL=player.service.js.map