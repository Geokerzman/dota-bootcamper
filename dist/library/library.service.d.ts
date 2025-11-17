import { Library, LibraryItemType } from '../models/library.model';
import { OpenDotaService } from '../services/open-dota.service';
export declare class LibraryService {
    private libraryModel;
    private openDotaService;
    private readonly logger;
    constructor(libraryModel: typeof Library, openDotaService: OpenDotaService);
    addToLibrary(userId: number, itemType: LibraryItemType, itemId: number, notes?: string): Promise<Library>;
    removeFromLibrary(userId: number, itemType: LibraryItemType, itemId: number): Promise<void>;
    getLibrary(userId: number, itemType?: LibraryItemType): Promise<Library[]>;
    updateNotes(userId: number, itemType: LibraryItemType, itemId: number, notes: string): Promise<Library>;
    isInLibrary(userId: number, itemType: LibraryItemType, itemId: number): Promise<boolean>;
}
