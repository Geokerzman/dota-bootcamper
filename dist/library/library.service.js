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
var LibraryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const library_model_1 = require("../models/library.model");
const open_dota_service_1 = require("../services/open-dota.service");
let LibraryService = LibraryService_1 = class LibraryService {
    constructor(libraryModel, openDotaService) {
        this.libraryModel = libraryModel;
        this.openDotaService = openDotaService;
        this.logger = new common_1.Logger(LibraryService_1.name);
    }
    async addToLibrary(userId, itemType, itemId, notes) {
        const existing = await this.libraryModel.findOne({
            where: { userId, itemType, itemId },
        });
        if (existing) {
            throw new common_1.BadRequestException('Item already in library');
        }
        let itemName = null;
        let metadata = null;
        try {
            switch (itemType) {
                case library_model_1.LibraryItemType.PLAYER:
                    const playerData = await this.openDotaService.fetchPlayerInfo(itemId.toString());
                    itemName = playerData.profile?.personaname || `Player ${itemId}`;
                    metadata = {
                        rankTier: playerData.rank_tier,
                        soloRank: playerData.solo_competitive_rank,
                        avatar: playerData.profile?.avatarmedium,
                    };
                    break;
                case library_model_1.LibraryItemType.HERO:
                    const heroes = await this.openDotaService.getHeroes();
                    const hero = heroes.find((h) => h.id === itemId);
                    itemName = hero?.localized_name || `Hero ${itemId}`;
                    metadata = {
                        primaryAttr: hero?.primary_attr,
                        attackType: hero?.attack_type,
                        roles: hero?.roles,
                    };
                    break;
                case library_model_1.LibraryItemType.MATCH:
                    const matchData = await this.openDotaService.getMatchData(itemId.toString());
                    itemName = `Match ${itemId}`;
                    metadata = {
                        duration: matchData.duration,
                        gameMode: matchData.game_mode,
                        radiantWin: matchData.radiant_win,
                    };
                    break;
            }
        }
        catch (error) {
            this.logger.warn(`Failed to fetch metadata for ${itemType} ${itemId}: ${error.message}`);
        }
        const libraryItem = await this.libraryModel.create({
            userId,
            itemType,
            itemId,
            itemName,
            metadata,
            notes,
        });
        this.logger.debug(`Added ${itemType} ${itemId} to library for user ${userId}`);
        return libraryItem;
    }
    async removeFromLibrary(userId, itemType, itemId) {
        const deleted = await this.libraryModel.destroy({
            where: { userId, itemType, itemId },
        });
        if (deleted === 0) {
            throw new common_1.NotFoundException('Item not found in library');
        }
        this.logger.debug(`Removed ${itemType} ${itemId} from library for user ${userId}`);
    }
    async getLibrary(userId, itemType) {
        const where = { userId };
        if (itemType) {
            where.itemType = itemType;
        }
        const items = await this.libraryModel.findAll({
            where,
            order: [['created_at', 'DESC']],
        });
        return items;
    }
    async updateNotes(userId, itemType, itemId, notes) {
        const item = await this.libraryModel.findOne({
            where: { userId, itemType, itemId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found in library');
        }
        await item.update({ notes });
        return item;
    }
    async isInLibrary(userId, itemType, itemId) {
        const count = await this.libraryModel.count({
            where: { userId, itemType, itemId },
        });
        return count > 0;
    }
};
exports.LibraryService = LibraryService;
exports.LibraryService = LibraryService = LibraryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(library_model_1.Library)),
    __metadata("design:paramtypes", [Object, open_dota_service_1.OpenDotaService])
], LibraryService);
//# sourceMappingURL=library.service.js.map