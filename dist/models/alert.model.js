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
exports.Alert = exports.AlertStatus = exports.AlertType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
var AlertType;
(function (AlertType) {
    AlertType["PLAYER_MATCH"] = "player_match";
    AlertType["PLAYER_RANK_CHANGE"] = "player_rank_change";
    AlertType["MATCH_STARTED"] = "match_started";
    AlertType["CUSTOM"] = "custom";
})(AlertType || (exports.AlertType = AlertType = {}));
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["ACTIVE"] = "active";
    AlertStatus["TRIGGERED"] = "triggered";
    AlertStatus["DISABLED"] = "disabled";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
let Alert = class Alert extends sequelize_typescript_1.Model {
};
exports.Alert = Alert;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Alert.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], Alert.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Alert.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertType)),
        allowNull: false,
        field: 'alert_type',
    }),
    __metadata("design:type", String)
], Alert.prototype, "alertType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        field: 'alert_name',
    }),
    __metadata("design:type", String)
], Alert.prototype, "alertName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: true,
        field: 'target_id',
        comment: 'account_id for players, match_id for matches',
    }),
    __metadata("design:type", Number)
], Alert.prototype, "targetId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        field: 'conditions',
        comment: 'Alert conditions (e.g., rank threshold, match type)',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "conditions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertStatus)),
        allowNull: false,
        defaultValue: AlertStatus.ACTIVE,
        field: 'status',
    }),
    __metadata("design:type", String)
], Alert.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'last_triggered',
    }),
    __metadata("design:type", Date)
], Alert.prototype, "lastTriggered", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], Alert.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], Alert.prototype, "updatedAt", void 0);
exports.Alert = Alert = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'alerts',
        timestamps: true,
        underscored: true,
    })
], Alert);
//# sourceMappingURL=alert.model.js.map