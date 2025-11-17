import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OpenDotaService } from '../services/open-dota.service';
import { PlayerCache } from '../models/player-cache.model';
import { PlayerInfoDto } from '../dto/player-info.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    @InjectModel(PlayerCache)
    private playerCacheModel: typeof PlayerCache,
    private openDotaService: OpenDotaService,
  ) {}

  /**
   * Get player info with caching (24h TTL)
   * - If player exists in DB and cache is valid, returns cached data
   * - If player doesn't exist in DB or cache is expired, fetches from API and saves to DB
   */
  async getPlayerInfo(accountId: string): Promise<PlayerInfoDto[]> {
    const accountIdNum = parseInt(accountId, 10);
    if (isNaN(accountIdNum)) {
      throw new NotFoundException('Invalid account ID');
    }

    // Check if player exists in database
    const cachedPlayer = await this.playerCacheModel.findOne({
      where: { accountId: accountIdNum },
    });

    // If player exists in DB and cache is valid (< 24 hours), return cached data
    if (cachedPlayer && this.openDotaService.isCacheValid(cachedPlayer.lastUpdated)) {
      this.logger.debug(`Using cached data for account_id: ${accountId}`);
      return this.formatPlayerInfoFromCache(cachedPlayer);
    }

    // Player doesn't exist in DB or cache is expired - fetch from API
    if (!cachedPlayer) {
      this.logger.debug(`Player not found in DB, fetching from API for account_id: ${accountId}`);
    } else {
      this.logger.debug(`Cache expired, fetching fresh data from API for account_id: ${accountId}`);
    }

    // Fetch player data from OpenDota API
    const apiData = await this.openDotaService.fetchPlayerInfo(accountId);

    if (!apiData || !apiData.profile) {
      throw new NotFoundException('Player not found or profile is private');
    }

    // Save player data to database (create if new, update if exists)
    await this.savePlayerToDatabase(accountIdNum, apiData);
    this.logger.debug(`Player data saved to database for account_id: ${accountId}`);

    // Return formatted data
    return this.formatPlayerInfo(apiData);
  }

  /**
   * Save player data to database
   * Creates a new record if player doesn't exist, updates if it does
   */
  private async savePlayerToDatabase(accountId: number, apiData: any): Promise<void> {
    try {
      // Fetch additional data for comprehensive storage
      const [wl, totals, counts, heroes, peers, ratings] = await Promise.allSettled([
        this.openDotaService.fetchWinLoss(accountId.toString()),
        this.openDotaService.fetchPlayerTotals(accountId.toString()),
        this.openDotaService.fetchPlayerCounts(accountId.toString()),
        this.openDotaService.fetchHeroes(accountId.toString()),
        this.openDotaService.fetchPeers(accountId.toString()),
        this.openDotaService.fetchRatings(accountId.toString()),
      ]);

      const playerData = {
        accountId,
        soloCompetitiveRank: apiData.solo_competitive_rank ?? null,
        competitiveRank: apiData.competitive_rank ?? null,
        rankTier: apiData.rank_tier ?? null,
        leaderboardRank: apiData.leaderboard_rank ?? null,
        profileData: apiData.profile || null,
        winLoss: wl.status === 'fulfilled' ? wl.value : null,
        totals: totals.status === 'fulfilled' ? totals.value : null,
        counts: counts.status === 'fulfilled' ? counts.value : null,
        heroes: heroes.status === 'fulfilled' ? heroes.value : null,
        peers: peers.status === 'fulfilled' ? peers.value : null,
        ratings: ratings.status === 'fulfilled' ? ratings.value : null,
        lastUpdated: new Date(),
      };

      // Use upsert to create if new, update if exists
      const [player, created] = await this.playerCacheModel.upsert(playerData, {
        returning: true,
      });

      if (created) {
        this.logger.debug(`New player record created in database for account_id: ${accountId}`);
      } else {
        this.logger.debug(`Player record updated in database for account_id: ${accountId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to save player to database for account_id ${accountId}: ${error.message}`);
      // Don't throw - we still want to return the data even if save fails
      // This ensures the API response is returned even if database operation fails
    }
  }

  /**
   * Format player info from API response
   */
  private formatPlayerInfo(apiData: any): PlayerInfoDto[] {
    const profile = apiData.profile || {};
    const playerInfo: PlayerInfoDto = {
      solo_competitive_rank: apiData.solo_competitive_rank ?? null,
      competitive_rank: apiData.competitive_rank ?? null,
      rank_tier: apiData.rank_tier ?? null,
      leaderboard_rank: apiData.leaderboard_rank ?? null,
      profile: {
        account_id: profile.account_id ?? null,
        personaname: profile.personaname ?? null,
        name: profile.name ?? null,
        steamid: profile.steamid ?? null,
        avatarmedium: profile.avatarmedium ?? null,
        last_login: profile.last_login ?? null,
        profileurl: profile.profileurl ?? null,
      },
    };
    return [playerInfo];
  }

  /**
   * Format player info from cache
   */
  private formatPlayerInfoFromCache(cachedPlayer: PlayerCache): PlayerInfoDto[] {
    const profile = cachedPlayer.profileData || {} as any;
    const playerInfo: PlayerInfoDto = {
      solo_competitive_rank: cachedPlayer.soloCompetitiveRank ?? null,
      competitive_rank: cachedPlayer.competitiveRank ?? null,
      rank_tier: cachedPlayer.rankTier ?? null,
      leaderboard_rank: cachedPlayer.leaderboardRank ?? null,
      profile: {
        account_id: profile.account_id ?? null,
        personaname: profile.personaname ?? null,
        name: profile.name ?? null,
        steamid: profile.steamid ?? null,
        avatarmedium: profile.avatarmedium ?? null,
        last_login: profile.last_login ?? null,
        profileurl: profile.profileurl ?? null,
      },
    };
    return [playerInfo];
  }

  /**
   * Get player totals with caching
   * Ensures player exists in DB before returning totals
   */
  async getTotals(accountId: string, query: any) {
    const accountIdNum = parseInt(accountId, 10);
    if (isNaN(accountIdNum)) {
      throw new NotFoundException('Invalid account ID');
    }

    // Check if player exists in database
    let cachedPlayer = await this.playerCacheModel.findOne({
      where: { accountId: accountIdNum },
    });

    // If player doesn't exist in DB, fetch and save basic info first
    if (!cachedPlayer) {
      this.logger.debug(`Player not in DB, fetching basic info for account_id: ${accountId}`);
      const apiData = await this.openDotaService.fetchPlayerInfo(accountId);
      if (apiData && apiData.profile) {
        await this.savePlayerToDatabase(accountIdNum, apiData);
        cachedPlayer = await this.playerCacheModel.findOne({
          where: { accountId: accountIdNum },
        });
      }
    }

    // Check if cached totals are valid
    if (
      cachedPlayer &&
      this.openDotaService.isCacheValid(cachedPlayer.lastUpdated) &&
      cachedPlayer.totals
    ) {
      this.logger.debug(`Using cached totals for account_id: ${accountId}`);
      return cachedPlayer.totals;
    }

    // Fetch from API and update cache
    this.logger.debug(`Fetching fresh totals from API for account_id: ${accountId}`);
    const totals = await this.openDotaService.fetchPlayerTotals(accountId, query);
    
    // Update player record with new totals
    if (cachedPlayer) {
      await cachedPlayer.update({ totals, lastUpdated: new Date() });
      this.logger.debug(`Totals updated in database for account_id: ${accountId}`);
    }

    return totals;
  }

  /**
   * Get player counts with caching
   * Ensures player exists in DB before returning counts
   */
  async getCounts(accountId: string, query: any) {
    const accountIdNum = parseInt(accountId, 10);
    if (isNaN(accountIdNum)) {
      throw new NotFoundException('Invalid account ID');
    }

    // Check if player exists in database
    let cachedPlayer = await this.playerCacheModel.findOne({
      where: { accountId: accountIdNum },
    });

    // If player doesn't exist in DB, fetch and save basic info first
    if (!cachedPlayer) {
      this.logger.debug(`Player not in DB, fetching basic info for account_id: ${accountId}`);
      const apiData = await this.openDotaService.fetchPlayerInfo(accountId);
      if (apiData && apiData.profile) {
        await this.savePlayerToDatabase(accountIdNum, apiData);
        cachedPlayer = await this.playerCacheModel.findOne({
          where: { accountId: accountIdNum },
        });
      }
    }

    // Check if cached counts are valid
    if (
      cachedPlayer &&
      this.openDotaService.isCacheValid(cachedPlayer.lastUpdated) &&
      cachedPlayer.counts
    ) {
      this.logger.debug(`Using cached counts for account_id: ${accountId}`);
      return cachedPlayer.counts;
    }

    // Fetch from API and update cache
    this.logger.debug(`Fetching fresh counts from API for account_id: ${accountId}`);
    const counts = await this.openDotaService.fetchPlayerCounts(accountId, query);
    
    // Update player record with new counts
    if (cachedPlayer) {
      await cachedPlayer.update({ counts, lastUpdated: new Date() });
      this.logger.debug(`Counts updated in database for account_id: ${accountId}`);
    }

    return counts;
  }

  /**
   * Search players (no caching - search results are dynamic)
   */
  async searchPlayers(query: string) {
    const players = await this.openDotaService.searchPlayers(query);
    return players;
  }

  /**
   * Get histograms (no caching - can be filtered by query params)
   */
  async getHistograms(accountId: string, field: string, query: any) {
    const histograms = await this.openDotaService.fetchHistogram(accountId, field, query);
    return histograms;
  }

  /**
   * Get player overview with caching
   * Ensures player exists in DB before returning overview
   */
  async getOverview(accountId: string) {
    const accountIdNum = parseInt(accountId, 10);
    if (isNaN(accountIdNum)) {
      throw new NotFoundException('Invalid account ID');
    }

    // Check if player exists in database
    const cachedPlayer = await this.playerCacheModel.findOne({
      where: { accountId: accountIdNum },
    });

    // If player exists in DB and cache is valid with all required data, return cached overview
    if (
      cachedPlayer &&
      this.openDotaService.isCacheValid(cachedPlayer.lastUpdated) &&
      cachedPlayer.profileData &&
      cachedPlayer.winLoss &&
      cachedPlayer.heroes &&
      cachedPlayer.peers &&
      cachedPlayer.totals &&
      cachedPlayer.counts &&
      cachedPlayer.ratings
    ) {
      this.logger.debug(`Using cached overview for account_id: ${accountId}`);
      return {
        profile: { profile: cachedPlayer.profileData, ...cachedPlayer },
        wl: cachedPlayer.winLoss,
        recentMatches: [], // Recent matches are not cached as they change frequently
        heroes: cachedPlayer.heroes,
        peers: cachedPlayer.peers,
        totals: cachedPlayer.totals,
        counts: cachedPlayer.counts,
        ratings: cachedPlayer.ratings,
      };
    }

    // Player doesn't exist in DB or cache is expired - fetch from API
    if (!cachedPlayer) {
      this.logger.debug(`Player not in DB, fetching overview from API for account_id: ${accountId}`);
    } else {
      this.logger.debug(`Cache expired, fetching fresh overview from API for account_id: ${accountId}`);
    }

    // Fetch from API and save to database
    const data = await this.openDotaService.fetchOverview(accountId);
    await this.savePlayerToDatabase(accountIdNum, data.profile);

    return data;
  }
}
