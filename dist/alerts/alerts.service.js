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
var AlertsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const alert_model_1 = require("../models/alert.model");
let AlertsService = AlertsService_1 = class AlertsService {
    constructor(alertModel) {
        this.alertModel = alertModel;
        this.logger = new common_1.Logger(AlertsService_1.name);
    }
    async createAlert(userId, alertType, alertName, targetId, conditions) {
        const alert = await this.alertModel.create({
            userId,
            alertType,
            alertName,
            targetId,
            conditions,
            status: alert_model_1.AlertStatus.ACTIVE,
        });
        this.logger.debug(`Created alert ${alertName} for user ${userId}`);
        return alert;
    }
    async getUserAlerts(userId, status) {
        const where = { userId };
        if (status) {
            where.status = status;
        }
        return this.alertModel.findAll({
            where,
            order: [['created_at', 'DESC']],
        });
    }
    async updateAlert(userId, alertId, updates) {
        const alert = await this.alertModel.findOne({
            where: { id: alertId, userId },
        });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        await alert.update(updates);
        return alert;
    }
    async deleteAlert(userId, alertId) {
        const deleted = await this.alertModel.destroy({
            where: { id: alertId, userId },
        });
        if (deleted === 0) {
            throw new common_1.NotFoundException('Alert not found');
        }
        this.logger.debug(`Deleted alert ${alertId} for user ${userId}`);
    }
    async triggerAlert(alertId) {
        const alert = await this.alertModel.findByPk(alertId);
        if (alert) {
            await alert.update({
                status: alert_model_1.AlertStatus.TRIGGERED,
                lastTriggered: new Date(),
            });
        }
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = AlertsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(alert_model_1.Alert)),
    __metadata("design:paramtypes", [Object])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map