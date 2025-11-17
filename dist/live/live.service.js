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
var LiveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveService = void 0;
const common_1 = require("@nestjs/common");
const open_dota_service_1 = require("../services/open-dota.service");
let LiveService = LiveService_1 = class LiveService {
    constructor(openDotaService) {
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(LiveService_1.name);
        this.heroCache = null;
        this.playerCache = {};
    }
    async getHeroes() {
        if (!this.heroCache) {
            this.logger.debug('Fetching heroes from OpenDota API for live matches');
            this.heroCache = await this.openDotaService.getHeroes();
        }
        return this.heroCache;
    }
    async getPlayerProfile(accountId) {
        if (!accountId)
            return null;
        if (this.playerCache[accountId]) {
            this.logger.debug(`Using cached profile for player: ${accountId}`);
            return this.playerCache[accountId];
        }
        try {
            this.logger.debug(`Fetching profile for player: ${accountId}`);
            const profile = await this.openDotaService.fetchPlayerInfo(accountId.toString());
            this.playerCache[accountId] = profile;
            return profile;
        }
        catch (err) {
            this.logger.warn(`Failed to fetch profile for player ${accountId}: ${err.message}`);
            return null;
        }
    }
    async getLiveGames() {
        this.logger.debug('Fetching live matches from OpenDota API');
        try {
            const liveMatches = await this.openDotaService.getLiveGames();
            this.logger.debug(`Total live matches fetched: ${liveMatches.length}`);
            if (!Array.isArray(liveMatches) || liveMatches.length === 0) {
                this.logger.warn('No live matches found');
                throw new common_1.NotFoundException('No live matches found');
            }
            const shuffledMatches = liveMatches.sort(() => 0.5 - Math.random());
            const randomMatches = shuffledMatches.slice(0, 3);
            this.logger.debug(`Random matches selected: ${randomMatches.map((match) => match.match_id).join(', ')}`);
            const heroes = await this.getHeroes();
            const matchDetails = await Promise.all(randomMatches.map(async (match) => {
                const radiantPlayers = match.players.filter((player) => player.team === 0).slice(0, 5);
                const direPlayers = match.players.filter((player) => player.team === 1).slice(0, 5);
                const players = await Promise.all([...radiantPlayers, ...direPlayers].map(async (player) => {
                    const hero = heroes.find((h) => h.id === player.hero_id);
                    const profile = await this.getPlayerProfile(player.account_id);
                    const rank = profile ? profile.rank_tier : null;
                    const formattedRank = rank ? `${Math.floor(rank / 10)}.${rank % 10}` : 'Unranked';
                    return {
                        account_id: player.account_id || null,
                        name: player.name || 'Anonymous',
                        hero_name: hero ? hero.localized_name : 'Hero not selected',
                        hero_id: player.hero_id || null,
                        team: player.team === 0 ? 'Radiant' : 'Dire',
                        kills: player.kills != null ? player.kills : 0,
                        deaths: player.deaths != null ? player.deaths : 0,
                        assists: player.assists != null ? player.assists : 0,
                        is_pro: player.is_pro || false,
                        team_name: player.team_name || 'N/A',
                        avatar: profile && profile.profile
                            ? profile.profile.avatarfull
                            : 'https://example.com/default-avatar.png',
                        rank: formattedRank,
                    };
                }));
                return {
                    match_id: match.match_id,
                    spectators: match.spectators || 0,
                    radiant_team: match.team_name_radiant || 'Radiant',
                    dire_team: match.team_name_dire || 'Dire',
                    radiant_score: match.radiant_score || 0,
                    dire_score: match.dire_score || 0,
                    players,
                };
            }));
            this.logger.debug(`Returning ${matchDetails.length} formatted match details`);
            return matchDetails;
        }
        catch (error) {
            this.logger.error(`Error fetching live matches: ${error.message}`);
            throw error;
        }
    }
};
exports.LiveService = LiveService;
exports.LiveService = LiveService = LiveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [open_dota_service_1.OpenDotaService])
], LiveService);
//# sourceMappingURL=live.service.js.map