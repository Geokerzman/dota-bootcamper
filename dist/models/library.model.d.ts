import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare enum LibraryItemType {
    PLAYER = "player",
    HERO = "hero",
    MATCH = "match"
}
export declare class Library extends Model<Library> {
    id: number;
    userId: number;
    user: User;
    itemType: LibraryItemType;
    itemId: number;
    itemName: string;
    metadata: any;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
