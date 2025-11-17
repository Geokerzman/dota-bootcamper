import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare enum AlertType {
    PLAYER_MATCH = "player_match",
    PLAYER_RANK_CHANGE = "player_rank_change",
    MATCH_STARTED = "match_started",
    CUSTOM = "custom"
}
export declare enum AlertStatus {
    ACTIVE = "active",
    TRIGGERED = "triggered",
    DISABLED = "disabled"
}
export declare class Alert extends Model<Alert> {
    id: number;
    userId: number;
    user: User;
    alertType: AlertType;
    alertName: string;
    targetId: number;
    conditions: any;
    status: AlertStatus;
    lastTriggered: Date;
    createdAt: Date;
    updatedAt: Date;
}
