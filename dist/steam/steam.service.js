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
exports.SteamService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const open_dota_service_1 = require("../services/open-dota.service");
const user_model_1 = require("../models/user.model");
let SteamService = class SteamService {
    constructor(userModel, openDotaService) {
        this.userModel = userModel;
        this.openDotaService = openDotaService;
    }
    async linkSteam(steamid, userId) {
        const player = await this.openDotaService.getPlayerSummaries(steamid);
        if (!player) {
            throw new common_1.BadRequestException('Invalid Steam ID');
        }
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.steamid = steamid;
        user.profileurl = player.profile?.profileurl || null;
        user.avatar = player.profile?.avatarfull || null;
        user.account_id = player.profile?.account_id || null;
        await user.save();
        return user;
    }
};
exports.SteamService = SteamService;
exports.SteamService = SteamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, open_dota_service_1.OpenDotaService])
], SteamService);
//# sourceMappingURL=steam.service.js.map