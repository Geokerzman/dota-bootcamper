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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("./player.service");
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async getPlayerInfo(accountId) {
        if (!accountId) {
            throw new common_1.BadRequestException('Account ID is required');
        }
        return this.playerService.getPlayerInfo(accountId);
    }
    async getTotals(accountId, query) {
        if (!accountId) {
            throw new common_1.BadRequestException('Account ID is required');
        }
        return this.playerService.getTotals(accountId, query);
    }
    async getCounts(accountId, query) {
        if (!accountId) {
            throw new common_1.BadRequestException('Account ID is required');
        }
        return this.playerService.getCounts(accountId, query);
    }
    async searchPlayers(query) {
        if (!query) {
            throw new common_1.BadRequestException('Search query (q) is required');
        }
        return this.playerService.searchPlayers(query);
    }
    async getHistograms(accountId, field, query) {
        if (!accountId || !field) {
            throw new common_1.BadRequestException('Account ID and field are required');
        }
        return this.playerService.getHistograms(accountId, field, query);
    }
    async getOverview(accountId) {
        if (!accountId) {
            throw new common_1.BadRequestException('Account ID is required');
        }
        return this.playerService.getOverview(accountId);
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('account_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getPlayerInfo", null);
__decorate([
    (0, common_1.Get)('totals'),
    __param(0, (0, common_1.Query)('account_id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getTotals", null);
__decorate([
    (0, common_1.Get)('counts'),
    __param(0, (0, common_1.Query)('account_id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getCounts", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "searchPlayers", null);
__decorate([
    (0, common_1.Get)('histograms'),
    __param(0, (0, common_1.Query)('account_id')),
    __param(1, (0, common_1.Query)('field')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getHistograms", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Query)('account_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getOverview", null);
exports.PlayerController = PlayerController = __decorate([
    (0, common_1.Controller)('api/playerinfo'),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
//# sourceMappingURL=player.controller.js.map