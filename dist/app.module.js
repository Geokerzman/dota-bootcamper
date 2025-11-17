"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const auth_module_1 = require("./auth/auth.module");
const player_module_1 = require("./player/player.module");
const match_module_1 = require("./match/match.module");
const hero_module_1 = require("./hero/hero.module");
const leaderboard_module_1 = require("./leaderboard/leaderboard.module");
const live_module_1 = require("./live/live.module");
const steam_module_1 = require("./steam/steam.module");
const pro_players_module_1 = require("./pro-players/pro-players.module");
const library_module_1 = require("./library/library.module");
const analytics_module_1 = require("./analytics/analytics.module");
const alerts_module_1 = require("./alerts/alerts.module");
const database_module_1 = require("./database/database.module");
const user_model_1 = require("./models/user.model");
const player_cache_model_1 = require("./models/player-cache.model");
const library_model_1 = require("./models/library.model");
const player_comparison_model_1 = require("./models/player-comparison.model");
const alert_model_1 = require("./models/alert.model");
const performance_trend_model_1 = require("./models/performance-trend.model");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            sequelize_1.SequelizeModule.forRoot({
                dialect: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '3306'),
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                models: [user_model_1.User, player_cache_model_1.PlayerCache, library_model_1.Library, player_comparison_model_1.PlayerComparison, alert_model_1.Alert, performance_trend_model_1.PerformanceTrend],
                autoLoadModels: true,
                synchronize: false,
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            player_module_1.PlayerModule,
            match_module_1.MatchModule,
            hero_module_1.HeroModule,
            leaderboard_module_1.LeaderboardModule,
            live_module_1.LiveModule,
            steam_module_1.SteamModule,
            pro_players_module_1.ProPlayersModule,
            library_module_1.LibraryModule,
            analytics_module_1.AnalyticsModule,
            alerts_module_1.AlertsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map