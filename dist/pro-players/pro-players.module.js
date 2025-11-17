"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProPlayersModule = void 0;
const common_1 = require("@nestjs/common");
const pro_players_controller_1 = require("./pro-players.controller");
const pro_players_service_1 = require("./pro-players.service");
const open_dota_service_1 = require("../services/open-dota.service");
let ProPlayersModule = class ProPlayersModule {
};
exports.ProPlayersModule = ProPlayersModule;
exports.ProPlayersModule = ProPlayersModule = __decorate([
    (0, common_1.Module)({
        controllers: [pro_players_controller_1.ProPlayersController],
        providers: [pro_players_service_1.ProPlayersService, open_dota_service_1.OpenDotaService],
    })
], ProPlayersModule);
//# sourceMappingURL=pro-players.module.js.map