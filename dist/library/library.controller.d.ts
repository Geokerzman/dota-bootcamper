import { LibraryService } from './library.service';
import { LibraryItemType } from '../models/library.model';
export declare class LibraryController {
    private libraryService;
    constructor(libraryService: LibraryService);
    getLibrary(user: any, type?: LibraryItemType): Promise<import("../models/library.model").Library[]>;
    addToLibrary(user: any, body: {
        itemType: LibraryItemType;
        itemId: number;
        notes?: string;
    }): Promise<import("../models/library.model").Library>;
    removeFromLibrary(user: any, type: LibraryItemType, id: string): Promise<{
        message: string;
    }>;
    updateNotes(user: any, type: LibraryItemType, id: string, body: {
        notes: string;
    }): Promise<import("../models/library.model").Library>;
    checkInLibrary(user: any, type: LibraryItemType, id: string): Promise<{
        isInLibrary: boolean;
    }>;
}
