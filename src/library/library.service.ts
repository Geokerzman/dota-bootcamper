import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Library, LibraryItemType } from '../models/library.model';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  constructor(
    @InjectModel(Library)
    private libraryModel: typeof Library,
    private openDotaService: OpenDotaService,
  ) {}

  /**
   * Add item to user's library
   */
  async addToLibrary(
    userId: number,
    itemType: LibraryItemType,
    itemId: number,
    notes?: string,
  ): Promise<Library> {
    // Check if already in library
    const existing = await this.libraryModel.findOne({
      where: { userId, itemType, itemId },
    });

    if (existing) {
      throw new BadRequestException('Item already in library');
    }

    // Fetch item metadata based on type
    let itemName: string | null = null;
    let metadata: any = null;

    try {
      switch (itemType) {
        case LibraryItemType.PLAYER:
          const playerData = await this.openDotaService.fetchPlayerInfo(itemId.toString());
          itemName = playerData.profile?.personaname || `Player ${itemId}`;
          metadata = {
            rankTier: playerData.rank_tier,
            soloRank: playerData.solo_competitive_rank,
            avatar: playerData.profile?.avatarmedium,
          };
          break;
        case LibraryItemType.HERO:
          const heroes = await this.openDotaService.getHeroes();
          const hero = heroes.find((h) => h.id === itemId);
          itemName = hero?.localized_name || `Hero ${itemId}`;
          metadata = {
            primaryAttr: hero?.primary_attr,
            attackType: hero?.attack_type,
            roles: hero?.roles,
          };
          break;
        case LibraryItemType.MATCH:
          const matchData = await this.openDotaService.getMatchData(itemId.toString());
          itemName = `Match ${itemId}`;
          metadata = {
            duration: matchData.duration,
            gameMode: matchData.game_mode,
            radiantWin: matchData.radiant_win,
          };
          break;
      }
    } catch (error) {
      this.logger.warn(`Failed to fetch metadata for ${itemType} ${itemId}: ${error.message}`);
    }

    const libraryItem = await this.libraryModel.create({
      userId,
      itemType,
      itemId,
      itemName,
      metadata,
      notes,
    });

    this.logger.debug(`Added ${itemType} ${itemId} to library for user ${userId}`);
    return libraryItem;
  }

  /**
   * Remove item from library
   */
  async removeFromLibrary(userId: number, itemType: LibraryItemType, itemId: number): Promise<void> {
    const deleted = await this.libraryModel.destroy({
      where: { userId, itemType, itemId },
    });

    if (deleted === 0) {
      throw new NotFoundException('Item not found in library');
    }

    this.logger.debug(`Removed ${itemType} ${itemId} from library for user ${userId}`);
  }

  /**
   * Get user's library items
   */
  async getLibrary(userId: number, itemType?: LibraryItemType) {
    const where: any = { userId };
    if (itemType) {
      where.itemType = itemType;
    }

    const items = await this.libraryModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    return items;
  }

  /**
   * Update library item notes
   */
  async updateNotes(userId: number, itemType: LibraryItemType, itemId: number, notes: string) {
    const item = await this.libraryModel.findOne({
      where: { userId, itemType, itemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found in library');
    }

    await item.update({ notes });
    return item;
  }

  /**
   * Check if item is in library
   */
  async isInLibrary(userId: number, itemType: LibraryItemType, itemId: number): Promise<boolean> {
    const count = await this.libraryModel.count({
      where: { userId, itemType, itemId },
    });
    return count > 0;
  }
}

