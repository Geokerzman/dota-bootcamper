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
var MatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const open_dota_service_1 = require("../services/open-dota.service");
const user_model_1 = require("../models/user.model");
const recommendations_1 = require("../utils/recommendations");
let MatchService = MatchService_1 = class MatchService {
    constructor(userModel, openDotaService) {
        this.userModel = userModel;
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(MatchService_1.name);
    }
    async getMatchHistory(userId) {
        this.logger.debug(`Fetching match history for user_id: ${userId}`);
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.account_id) {
            throw new common_1.NotFoundException('User account_id not found. Please link your Steam account first.');
        }
        try {
            const matches = await this.openDotaService.getMatchHistory(user.account_id.toString());
            this.logger.debug(`Retrieved ${matches.length} matches for user_id: ${userId}`);
            return matches;
        }
        catch (error) {
            this.logger.error(`Failed to fetch match history for user_id ${userId}: ${error.message}`);
            throw error;
        }
    }
    async getMatchDetails(matchId) {
        this.logger.debug(`Fetching match details for match_id: ${matchId}`);
        try {
            const matchDetails = await this.openDotaService.getMatchDetail(matchId);
            if (!matchDetails) {
                throw new common_1.NotFoundException('Match not found');
            }
            const recommendations = await (0, recommendations_1.generateRecommendations)(matchDetails);
            this.logger.debug(`Match details retrieved successfully for match_id: ${matchId}`);
            return { matchDetails, recommendations };
        }
        catch (error) {
            this.logger.error(`Failed to fetch match details for match_id ${matchId}: ${error.message}`);
            throw error;
        }
    }
    async getMatchData(matchId) {
        this.logger.debug(`Fetching match data for match_id: ${matchId}`);
        try {
            const matchData = await this.openDotaService.getMatchData(matchId);
            return matchData;
        }
        catch (error) {
            this.logger.error(`Failed to fetch match data for match_id ${matchId}: ${error.message}`);
            throw error;
        }
    }
    async getRecentMatches() {
        this.logger.debug('Fetching recent public matches');
        try {
            const matches = await this.openDotaService.getPublicMatches();
            if (!Array.isArray(matches)) {
                throw new common_1.NotFoundException('Unexpected response format from OpenDota API');
            }
            const recentMatches = matches.map((match) => ({
                matchId: match.match_id,
                duration: match.duration,
                startTime: match.start_time,
                radiantTeam: match.radiant_name || 'Unknown Team',
                direTeam: match.dire_name || 'Unknown Team',
                radiantWin: match.radiant_win,
                game_mode: match.game_mode,
                avg_rank_tier: match.avg_rank_tier,
                num_rank_tier: match.num_rank_tier,
            }));
            this.logger.debug(`Retrieved ${recentMatches.length} recent matches`);
            return recentMatches;
        }
        catch (error) {
            this.logger.error(`Failed to fetch recent matches: ${error.message}`);
            throw error;
        }
    }
    async getRecentProMatches() {
        this.logger.debug('Fetching recent pro matches');
        try {
            const matches = await this.openDotaService.getProMatches();
            if (!Array.isArray(matches)) {
                throw new common_1.NotFoundException('Unexpected response format from OpenDota API');
            }
            const proMatches = matches.map((match) => ({
                matchId: match.match_id,
                duration: match.duration,
                startTime: match.start_time,
                radiantTeam: match.radiant_name || 'Unknown Team',
                direTeam: match.dire_name || 'Unknown Team',
                league: match.league_name || 'Unknown League',
                radiantScore: match.radiant_score,
                direScore: match.dire_score,
                radiantWin: match.radiant_win,
            }));
            this.logger.debug(`Retrieved ${proMatches.length} recent pro matches`);
            return proMatches;
        }
        catch (error) {
            this.logger.error(`Failed to fetch recent pro matches: ${error.message}`);
            throw error;
        }
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = MatchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, open_dota_service_1.OpenDotaService])
], MatchService);
//# sourceMappingURL=match.service.js.map