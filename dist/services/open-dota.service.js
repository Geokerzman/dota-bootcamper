"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OpenDotaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenDotaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const OPEN_DOTA_API_BASE_URL = 'https://api.opendota.com/api';
const CACHE_TTL_HOURS = 24;
let OpenDotaService = OpenDotaService_1 = class OpenDotaService {
    constructor() {
        this.logger = new common_1.Logger(OpenDotaService_1.name);
    }
    isCacheValid(lastUpdated) {
        const now = new Date();
        const diffInHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        return diffInHours < CACHE_TTL_HOURS;
    }
    handleApiError(error, context) {
        if (error.response) {
            this.logger.error(`${context} - API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            throw new common_1.HttpException({
                message: `OpenDota API error: ${error.response.statusText}`,
                statusCode: error.response.status,
                error: error.response.data,
            }, error.response.status);
        }
        else if (error.request) {
            this.logger.error(`${context} - No response from OpenDota API`);
            throw new common_1.HttpException({
                message: 'Unable to reach OpenDota API',
                statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
            }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        else {
            this.logger.error(`${context} - Error: ${error.message}`);
            throw new common_1.HttpException({
                message: 'An unexpected error occurred',
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async fetchPlayerInfo(accountId) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}`;
            this.logger.debug(`Fetching player info for account_id: ${accountId}`);
            const { data } = await axios_1.default.get(url);
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchPlayerInfo(${accountId})`);
        }
    }
    async fetchPlayerTotals(accountId, queryParams = {}) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/totals`;
            const { data } = await axios_1.default.get(url, { params: queryParams });
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchPlayerTotals(${accountId})`);
        }
    }
    async fetchPlayerCounts(accountId, queryParams = {}) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/counts`;
            const { data } = await axios_1.default.get(url, { params: queryParams });
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchPlayerCounts(${accountId})`);
        }
    }
    async searchPlayers(query) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/search`;
            const { data } = await axios_1.default.get(url, { params: { q: query } });
            return data;
        }
        catch (error) {
            this.handleApiError(error, `searchPlayers(${query})`);
        }
    }
    async fetchHistogram(accountId, field, queryParams = {}) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/histograms/${field}`;
            const { data } = await axios_1.default.get(url, { params: queryParams });
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchHistogram(${accountId}, ${field})`);
        }
    }
    async fetchWinLoss(accountId) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/wl`;
            const { data } = await axios_1.default.get(url);
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchWinLoss(${accountId})`);
        }
    }
    async fetchRecentMatches(accountId, limit = 20) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/recentMatches`;
            const { data } = await axios_1.default.get(url, { params: { limit } });
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchRecentMatches(${accountId})`);
        }
    }
    async fetchHeroes(accountId) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/heroes`;
            const { data } = await axios_1.default.get(url);
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchHeroes(${accountId})`);
        }
    }
    async fetchPeers(accountId) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/peers`;
            const { data } = await axios_1.default.get(url);
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchPeers(${accountId})`);
        }
    }
    async fetchRatings(accountId) {
        try {
            const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/ratings`;
            const { data } = await axios_1.default.get(url);
            return data;
        }
        catch (error) {
            this.handleApiError(error, `fetchRatings(${accountId})`);
        }
    }
    async fetchOverview(accountId) {
        const [profile, wl, recentMatches, heroes, peers, totals, counts, ratings] = await Promise.all([
            this.fetchPlayerInfo(accountId),
            this.fetchWinLoss(accountId),
            this.fetchRecentMatches(accountId, 20),
            this.fetchHeroes(accountId),
            this.fetchPeers(accountId),
            this.fetchPlayerTotals(accountId),
            this.fetchPlayerCounts(accountId),
            this.fetchRatings(accountId),
        ]);
        return { profile, wl, recentMatches, heroes, peers, totals, counts, ratings };
    }
    async getPlayerSummaries(accountId) {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/players/${accountId}`);
            return response.data;
        }
        catch (error) {
            this.logger.warn(`getPlayerSummaries(${accountId}) failed: ${error.message}`);
            return null;
        }
    }
    async getMatchHistory(accountId) {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/players/${accountId}/matches`);
            return response.data;
        }
        catch (error) {
            this.logger.warn(`getMatchHistory(${accountId}) failed: ${error.message}`);
            return [];
        }
    }
    async getMatchDetail(matchId) {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/matches/${matchId}`);
            return response.data;
        }
        catch (error) {
            this.logger.warn(`getMatchDetail(${matchId}) failed: ${error.message}`);
            return null;
        }
    }
    async getMatchData(matchId) {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/matches/${matchId}`);
            return response.data;
        }
        catch (error) {
            this.handleApiError(error, `getMatchData(${matchId})`);
        }
    }
    async getHeroes() {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/heroes`);
            return response.data;
        }
        catch (error) {
            this.handleApiError(error, 'getHeroes()');
        }
    }
    async getLiveGames() {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/live`);
            return response.data;
        }
        catch (error) {
            this.handleApiError(error, 'getLiveGames()');
        }
    }
    async getProPlayers() {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/proPlayers`);
            return response.data;
        }
        catch (error) {
            this.handleApiError(error, 'getProPlayers()');
        }
    }
    async getPublicMatches() {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/publicMatches`);
            return response.data;
        }
        catch (error) {
            this.handleApiError(error, 'getPublicMatches()');
        }
    }
    async getProMatches() {
        try {
            const response = await axios_1.default.get(`${OPEN_DOTA_API_BASE_URL}/proMatches`);
            return response.data;
        }
        catch (error) {
            this.handleApiError(error, 'getProMatches()');
        }
    }
};
exports.OpenDotaService = OpenDotaService;
exports.OpenDotaService = OpenDotaService = OpenDotaService_1 = __decorate([
    (0, common_1.Injectable)()
], OpenDotaService);
//# sourceMappingURL=open-dota.service.js.map