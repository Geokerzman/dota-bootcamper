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
var HeroService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroService = void 0;
const common_1 = require("@nestjs/common");
const open_dota_service_1 = require("../services/open-dota.service");
let HeroService = HeroService_1 = class HeroService {
    constructor(openDotaService) {
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(HeroService_1.name);
    }
    async getHeroes() {
        this.logger.debug('Fetching heroes list');
        try {
            const heroes = await this.openDotaService.getHeroes();
            if (!Array.isArray(heroes)) {
                throw new common_1.BadRequestException('Unexpected response format from OpenDota API');
            }
            const heroesInfo = heroes.map((hero) => ({
                id: hero.id,
                name: hero.name,
                localized_name: hero.localized_name,
                primary_attr: hero.primary_attr,
                attack_type: hero.attack_type,
                roles: hero.roles,
            }));
            this.logger.debug(`Retrieved ${heroesInfo.length} heroes`);
            return heroesInfo;
        }
        catch (error) {
            this.logger.error(`Failed to fetch heroes: ${error.message}`);
            throw error;
        }
    }
};
exports.HeroService = HeroService;
exports.HeroService = HeroService = HeroService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [open_dota_service_1.OpenDotaService])
], HeroService);
//# sourceMappingURL=hero.service.js.map