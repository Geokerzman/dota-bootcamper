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
exports.PlayerComparison = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
let PlayerComparison = class PlayerComparison extends sequelize_typescript_1.Model {
};
exports.PlayerComparison = PlayerComparison;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], PlayerComparison.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], PlayerComparison.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], PlayerComparison.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        field: 'comparison_name',
        comment: 'User-defined name for this comparison',
    }),
    __metadata("design:type", String)
], PlayerComparison.prototype, "comparisonName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        field: 'player_ids',
        comment: 'Array of account_ids being compared',
    }),
    __metadata("design:type", Array)
], PlayerComparison.prototype, "playerIds", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'comparison_data',
        comment: 'Cached comparison results',
    }),
    __metadata("design:type", Object)
], PlayerComparison.prototype, "comparisonData", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], PlayerComparison.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], PlayerComparison.prototype, "updatedAt", void 0);
exports.PlayerComparison = PlayerComparison = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'player_comparisons',
        timestamps: true,
        underscored: true,
    })
], PlayerComparison);
//# sourceMappingURL=player-comparison.model.js.map