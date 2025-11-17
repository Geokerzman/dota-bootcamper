import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Alert, AlertType, AlertStatus } from '../models/alert.model';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectModel(Alert)
    private alertModel: typeof Alert,
  ) {}

  /**
   * Create a new alert
   */
  async createAlert(
    userId: number,
    alertType: AlertType,
    alertName: string,
    targetId?: number,
    conditions?: any,
  ): Promise<Alert> {
    const alert = await this.alertModel.create({
      userId,
      alertType,
      alertName,
      targetId,
      conditions,
      status: AlertStatus.ACTIVE,
    });

    this.logger.debug(`Created alert ${alertName} for user ${userId}`);
    return alert;
  }

  /**
   * Get user's alerts
   */
  async getUserAlerts(userId: number, status?: AlertStatus) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    return this.alertModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * Update alert
   */
  async updateAlert(
    userId: number,
    alertId: number,
    updates: { alertName?: string; conditions?: any; status?: AlertStatus },
  ) {
    const alert = await this.alertModel.findOne({
      where: { id: alertId, userId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    await alert.update(updates);
    return alert;
  }

  /**
   * Delete alert
   */
  async deleteAlert(userId: number, alertId: number): Promise<void> {
    const deleted = await this.alertModel.destroy({
      where: { id: alertId, userId },
    });

    if (deleted === 0) {
      throw new NotFoundException('Alert not found');
    }

    this.logger.debug(`Deleted alert ${alertId} for user ${userId}`);
  }

  /**
   * Trigger alert (mark as triggered)
   */
  async triggerAlert(alertId: number): Promise<void> {
    const alert = await this.alertModel.findByPk(alertId);
    if (alert) {
      await alert.update({
        status: AlertStatus.TRIGGERED,
        lastTriggered: new Date(),
      });
    }
  }
}

