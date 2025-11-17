import { AlertsService } from './alerts.service';
import { AlertType, AlertStatus } from '../models/alert.model';
export declare class AlertsController {
    private alertsService;
    constructor(alertsService: AlertsService);
    createAlert(user: any, body: {
        alertType: AlertType;
        alertName: string;
        targetId?: number;
        conditions?: any;
    }): Promise<import("../models/alert.model").Alert>;
    getUserAlerts(user: any, status?: AlertStatus): Promise<import("../models/alert.model").Alert[]>;
    updateAlert(user: any, id: string, body: {
        alertName?: string;
        conditions?: any;
        status?: AlertStatus;
    }): Promise<import("../models/alert.model").Alert>;
    deleteAlert(user: any, id: string): Promise<{
        message: string;
    }>;
}
