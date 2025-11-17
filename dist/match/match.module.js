"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchModule = void 0;
const common_1 = require("@nestjs/common");
const match_controller_1 = require("./match.controller");
const match_detail_controller_1 = require("./match-detail.controller");
const match_summary_controller_1 = require("./match-summary.controller");
const recent_matches_controller_1 = require("./recent-matches.controller");
const recent_pro_matches_controller_1 = require("./recent-pro-matches.controller");
const match_service_1 = require("./match.service");
const open_dota_service_1 = require("../services/open-dota.service");
const database_module_1 = require("../database/database.module");
const auth_module_1 = require("../auth/auth.module");
let MatchModule = class MatchModule {
};
exports.MatchModule = MatchModule;
exports.MatchModule = MatchModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [
            match_controller_1.MatchController,
            match_detail_controller_1.MatchDetailController,
            match_summary_controller_1.MatchSummaryController,
            recent_matches_controller_1.RecentMatchesController,
            recent_pro_matches_controller_1.RecentProMatchesController,
        ],
        providers: [match_service_1.MatchService, open_dota_service_1.OpenDotaService],
    })
], MatchModule);
//# sourceMappingURL=match.module.js.map