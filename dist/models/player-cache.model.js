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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerCache = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let PlayerCache = class PlayerCache extends sequelize_typescript_1.Model {
};
exports.PlayerCache = PlayerCache;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], PlayerCache.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        unique: true,
        field: 'account_id',
    }),
    __metadata("design:type", Number)
], PlayerCache.prototype, "accountId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'solo_competitive_rank',
    }),
    __metadata("design:type", Number)
], PlayerCache.prototype, "soloCompetitiveRank", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'competitive_rank',
    }),
    __metadata("design:type", Number)
], PlayerCache.prototype, "competitiveRank", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'rank_tier',
    }),
    __metadata("design:type", Number)
], PlayerCache.prototype, "rankTier", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'leaderboard_rank',
    }),
    __metadata("design:type", Number)
], PlayerCache.prototype, "leaderboardRank", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'profile_data',
    }),
    __metadata("design:type", Object)
], PlayerCache.prototype, "profileData", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'win_loss',
    }),
    __metadata("design:type", Object)
], PlayerCache.prototype, "winLoss", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'totals',
    }),
    __metadata("design:type", Array)
], PlayerCache.prototype, "totals", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'counts',
    }),
    __metadata("design:type", Object)
], PlayerCache.prototype, "counts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'heroes',
    }),
    __metadata("design:type", Array)
], PlayerCache.prototype, "heroes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'peers',
    }),
    __metadata("design:type", Array)
], PlayerCache.prototype, "peers", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'ratings',
    }),
    __metadata("design:type", Array)
], PlayerCache.prototype, "ratings", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        field: 'last_updated',
    }),
    __metadata("design:type", Date)
], PlayerCache.prototype, "lastUpdated", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], PlayerCache.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], PlayerCache.prototype, "updatedAt", void 0);
exports.PlayerCache = PlayerCache = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'player_cache',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['account_id'],
            },
        ],
    })
], PlayerCache);
//# sourceMappingURL=player-cache.model.js.map