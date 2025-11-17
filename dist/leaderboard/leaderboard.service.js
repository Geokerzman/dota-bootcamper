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
var LeaderboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const open_dota_service_1 = require("../services/open-dota.service");
let LeaderboardService = LeaderboardService_1 = class LeaderboardService {
    constructor(openDotaService) {
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(LeaderboardService_1.name);
    }
    async getLeaderboard() {
        this.logger.debug('Fetching leaderboard data');
        try {
            const players = await this.openDotaService.getProPlayers();
            if (!Array.isArray(players)) {
                throw new common_1.BadRequestException('Unexpected response format from OpenDota API');
            }
            const formattedPlayers = players.map((player) => ({
                username: player.name,
                team: player.team_name || 'Unknown Team',
                profileurl: `https://www.opendota.com/players/${player.account_id}`,
                avatar: player.avatarfull,
            }));
            this.logger.debug(`Retrieved ${formattedPlayers.length} leaderboard entries`);
            return formattedPlayers;
        }
        catch (error) {
            this.logger.error(`Failed to fetch leaderboard: ${error.message}`);
            throw error;
        }
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = LeaderboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [open_dota_service_1.OpenDotaService])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map