"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroModule = void 0;
const common_1 = require("@nestjs/common");
const hero_controller_1 = require("./hero.controller");
const hero_service_1 = require("./hero.service");
const open_dota_service_1 = require("../services/open-dota.service");
let HeroModule = class HeroModule {
};
exports.HeroModule = HeroModule;
exports.HeroModule = HeroModule = __decorate([
    (0, common_1.Module)({
        controllers: [hero_controller_1.HeroController],
        providers: [hero_service_1.HeroService, open_dota_service_1.OpenDotaService],
    })
], HeroModule);
//# sourceMappingURL=hero.module.js.map