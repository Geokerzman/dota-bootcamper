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
exports.PerformanceTrend = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
let PerformanceTrend = class PerformanceTrend extends sequelize_typescript_1.Model {
};
exports.PerformanceTrend = PerformanceTrend;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], PerformanceTrend.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], PerformanceTrend.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], PerformanceTrend.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        field: 'account_id',
    }),
    __metadata("design:type", Number)
], PerformanceTrend.prototype, "accountId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        field: 'metrics',
        comment: 'Performance metrics snapshot (win rate, KDA, MMR, etc.)',
    }),
    __metadata("design:type", Object)
], PerformanceTrend.prototype, "metrics", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'recorded_at',
        comment: 'When this snapshot was recorded',
    }),
    __metadata("design:type", Date)
], PerformanceTrend.prototype, "recordedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], PerformanceTrend.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], PerformanceTrend.prototype, "updatedAt", void 0);
exports.PerformanceTrend = PerformanceTrend = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'performance_trends',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['user_id', 'account_id', 'recorded_at'],
            },
        ],
    })
], PerformanceTrend);
//# sourceMappingURL=performance-trend.model.js.map