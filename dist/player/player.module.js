"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerModule = void 0;
const common_1 = require("@nestjs/common");
const player_controller_1 = require("./player.controller");
const player_service_1 = require("./player.service");
const open_dota_service_1 = require("../services/open-dota.service");
const database_module_1 = require("../database/database.module");
let PlayerModule = class PlayerModule {
};
exports.PlayerModule = PlayerModule;
exports.PlayerModule = PlayerModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [player_controller_1.PlayerController],
        providers: [player_service_1.PlayerService, open_dota_service_1.OpenDotaService],
    })
], PlayerModule);
//# sourceMappingURL=player.module.js.map