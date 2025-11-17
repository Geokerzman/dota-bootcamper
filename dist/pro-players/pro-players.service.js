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
var ProPlayersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProPlayersService = void 0;
const common_1 = require("@nestjs/common");
const open_dota_service_1 = require("../services/open-dota.service");
let ProPlayersService = ProPlayersService_1 = class ProPlayersService {
    constructor(openDotaService) {
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(ProPlayersService_1.name);
    }
    async getProPlayers() {
        this.logger.debug('Fetching pro players list');
        try {
            const players = await this.openDotaService.getProPlayers();
            if (!Array.isArray(players) || players.length === 0) {
                throw new common_1.NotFoundException('No pro players found');
            }
            const proPlayers = players.map((player) => ({
                account_id: player.account_id,
                personaname: player.personaname || 'N/A',
                name: player.name || 'N/A',
                steamid: player.steamid,
                avatarmedium: player.avatarmedium || '',
                last_login: player.last_login || 'N/A',
                profileurl: player.profileurl,
                team_id: player.team_id || 'N/A',
                team_name: player.team_name || 'N/A',
            }));
            this.logger.debug(`Retrieved ${proPlayers.length} pro players`);
            return proPlayers;
        }
        catch (error) {
            this.logger.error(`Failed to fetch pro players: ${error.message}`);
            throw error;
        }
    }
};
exports.ProPlayersService = ProPlayersService;
exports.ProPlayersService = ProPlayersService = ProPlayersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [open_dota_service_1.OpenDotaService])
], ProPlayersService);
//# sourceMappingURL=pro-players.service.js.map