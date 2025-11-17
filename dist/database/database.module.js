"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../models/user.model");
const player_cache_model_1 = require("../models/player-cache.model");
const library_model_1 = require("../models/library.model");
const player_comparison_model_1 = require("../models/player-comparison.model");
const alert_model_1 = require("../models/alert.model");
const performance_trend_model_1 = require("../models/performance-trend.model");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                user_model_1.User,
                player_cache_model_1.PlayerCache,
                library_model_1.Library,
                player_comparison_model_1.PlayerComparison,
                alert_model_1.Alert,
                performance_trend_model_1.PerformanceTrend,
            ]),
        ],
        exports: [sequelize_1.SequelizeModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map