import { Alert, AlertType, AlertStatus } from '../models/alert.model';
export declare class AlertsService {
    private alertModel;
    private readonly logger;
    constructor(alertModel: typeof Alert);
    createAlert(userId: number, alertType: AlertType, alertName: string, targetId?: number, conditions?: any): Promise<Alert>;
    getUserAlerts(userId: number, status?: AlertStatus): Promise<Alert[]>;
    updateAlert(userId: number, alertId: number, updates: {
        alertName?: string;
        conditions?: any;
        status?: AlertStatus;
    }): Promise<Alert>;
    deleteAlert(userId: number, alertId: number): Promise<void>;
    triggerAlert(alertId: number): Promise<void>;
}
