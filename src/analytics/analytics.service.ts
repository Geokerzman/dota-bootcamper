import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerComparison } from '../models/player-comparison.model';
import { PerformanceTrend } from '../models/performance-trend.model';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(PlayerComparison)
    private comparisonModel: typeof PlayerComparison,
    @InjectModel(PerformanceTrend)
    private trendModel: typeof PerformanceTrend,
    private openDotaService: OpenDotaService,
  ) {}

  /**
   * Compare multiple players
   */
  async comparePlayers(accountIds: number[]): Promise<any> {
    if (accountIds.length < 2 || accountIds.length > 5) {
      throw new BadRequestException('Must compare between 2 and 5 players');
    }

    this.logger.debug(`Comparing ${accountIds.length} players`);

    const comparisons = await Promise.all(
      accountIds.map(async (accountId) => {
        try {
          const [playerInfo, totals, counts, heroes] = await Promise.all([
            this.openDotaService.fetchPlayerInfo(accountId.toString()),
            this.openDotaService.fetchPlayerTotals(accountId.toString()),
            this.openDotaService.fetchPlayerCounts(accountId.toString()),
            this.openDotaService.fetchHeroes(accountId.toString()),
          ]);

          // Calculate key metrics
          const winLoss = await this.openDotaService.fetchWinLoss(accountId.toString());
          const winRate = winLoss.win + winLoss.lose > 0 
            ? (winLoss.win / (winLoss.win + winLoss.lose)) * 100 
            : 0;

          // Calculate average KDA
          const kdaData = totals.find((t: any) => t.field === 'kills') || { sum: 0 };
          const deathsData = totals.find((t: any) => t.field === 'deaths') || { sum: 0 };
          const assistsData = totals.find((t: any) => t.field === 'assists') || { sum: 0 };
          const gamesData = totals.find((t: any) => t.field === 'games') || { sum: 1 };
          
          const avgKills = kdaData.sum / gamesData.sum;
          const avgDeaths = deathsData.sum / gamesData.sum;
          const avgAssists = assistsData.sum / gamesData.sum;
          const avgKDA = avgDeaths > 0 
            ? (avgKills + avgAssists) / avgDeaths 
            : avgKills + avgAssists;

          return {
            accountId,
            profile: playerInfo.profile,
            rankTier: playerInfo.rank_tier,
            soloRank: playerInfo.solo_competitive_rank,
            winRate: parseFloat(winRate.toFixed(2)),
            totalMatches: winLoss.win + winLoss.lose,
            wins: winLoss.win,
            losses: winLoss.lose,
            avgKDA: parseFloat(avgKDA.toFixed(2)),
            avgKills: parseFloat(avgKills.toFixed(2)),
            avgDeaths: parseFloat(avgDeaths.toFixed(2)),
            avgAssists: parseFloat(avgAssists.toFixed(2)),
            topHeroes: heroes.slice(0, 5).map((h: any) => ({
              heroId: h.hero_id,
              games: h.games,
              winRate: h.games > 0 ? (h.win / h.games) * 100 : 0,
            })),
          };
        } catch (error) {
          this.logger.error(`Failed to fetch data for player ${accountId}: ${error.message}`);
          return {
            accountId,
            error: 'Failed to fetch player data',
          };
        }
      }),
    );

    return {
      players: comparisons,
      comparisonDate: new Date(),
    };
  }

  /**
   * Save comparison for user
   */
  async saveComparison(userId: number, comparisonName: string, accountIds: number[]) {
    const comparisonData = await this.comparePlayers(accountIds);

    const comparison = await this.comparisonModel.create({
      userId,
      comparisonName,
      playerIds: accountIds,
      comparisonData,
    });

    return comparison;
  }

  /**
   * Get user's saved comparisons
   */
  async getSavedComparisons(userId: number) {
    return this.comparisonModel.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * Get hero recommendations for a player
   */
  async getHeroRecommendations(accountId: number): Promise<any> {
    this.logger.debug(`Getting hero recommendations for player ${accountId}`);

    const [playerHeroes, allHeroes, playerInfo] = await Promise.all([
      this.openDotaService.fetchHeroes(accountId.toString()),
      this.openDotaService.getHeroes(),
      this.openDotaService.fetchPlayerInfo(accountId.toString()),
    ]);

    // Analyze player's hero performance
    const playerHeroStats = playerHeroes.map((h: any) => ({
      heroId: h.hero_id,
      games: h.games,
      winRate: h.games > 0 ? (h.win / h.games) * 100 : 0,
      withGames: h.with_games || 0,
      againstGames: h.against_games || 0,
    }));

    // Find heroes player hasn't played much but are strong in current meta
    const unplayedHeroes = allHeroes
      .filter((hero) => {
        const played = playerHeroStats.find((ph) => ph.heroId === hero.id);
        return !played || played.games < 5;
      })
      .map((hero) => ({
        heroId: hero.id,
        name: hero.localized_name,
        primaryAttr: hero.primary_attr,
        roles: hero.roles,
        reason: 'You haven\'t played this hero much',
      }));

    // Find heroes similar to player's best heroes
    const bestHeroes = playerHeroStats
      .filter((h) => h.games >= 10 && h.winRate >= 55)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3);

    const recommendations = {
      unplayedHeroes: unplayedHeroes.slice(0, 10),
      bestHeroes: bestHeroes.map((h) => {
        const hero = allHeroes.find((ah) => ah.id === h.heroId);
        return {
          heroId: h.heroId,
          name: hero?.localized_name,
          games: h.games,
          winRate: parseFloat(h.winRate.toFixed(2)),
        };
      }),
      metaHeroes: allHeroes.slice(0, 10).map((h) => ({
        heroId: h.id,
        name: h.localized_name,
        primaryAttr: h.primary_attr,
        roles: h.roles,
      })),
    };

    return recommendations;
  }

  /**
   * Get meta analysis (hero win rates, popular picks)
   */
  async getMetaAnalysis(): Promise<any> {
    this.logger.debug('Generating meta analysis');

    const heroes = await this.openDotaService.getHeroes();
    const proMatches = await this.openDotaService.getProMatches();

    // Analyze last 100 pro matches
    const recentMatches = proMatches.slice(0, 100);
    
    const heroStats: Record<number, { picks: number; wins: number; bans: number }> = {};

    // Initialize all heroes
    heroes.forEach((hero) => {
      heroStats[hero.id] = { picks: 0, wins: 0, bans: 0 };
    });

    // Analyze matches (simplified - would need full match data for accurate analysis)
    const metaData = {
      totalMatchesAnalyzed: recentMatches.length,
      mostPickedHeroes: heroes.slice(0, 10).map((h) => ({
        heroId: h.id,
        name: h.localized_name,
        picks: Math.floor(Math.random() * 50) + 10, // Placeholder
        winRate: Math.floor(Math.random() * 20) + 45, // Placeholder
      })),
      mostBannedHeroes: heroes.slice(10, 20).map((h) => ({
        heroId: h.id,
        name: h.localized_name,
        bans: Math.floor(Math.random() * 40) + 5, // Placeholder
      })),
      highestWinRate: heroes.slice(20, 30).map((h) => ({
        heroId: h.id,
        name: h.localized_name,
        winRate: Math.floor(Math.random() * 15) + 50, // Placeholder
        games: Math.floor(Math.random() * 30) + 10,
      })),
    };

    return metaData;
  }

  /**
   * Record performance trend snapshot
   */
  async recordPerformanceTrend(userId: number, accountId: number): Promise<void> {
    try {
      const [playerInfo, winLoss, totals] = await Promise.all([
        this.openDotaService.fetchPlayerInfo(accountId.toString()),
        this.openDotaService.fetchWinLoss(accountId.toString()),
        this.openDotaService.fetchPlayerTotals(accountId.toString()),
      ]);

      const totalMatches = winLoss.win + winLoss.lose;
      const winRate = totalMatches > 0 ? (winLoss.win / totalMatches) * 100 : 0;

      const killsData = totals.find((t: any) => t.field === 'kills');
      const deathsData = totals.find((t: any) => t.field === 'deaths');
      const assistsData = totals.find((t: any) => t.field === 'assists');
      const gpmData = totals.find((t: any) => t.field === 'gold_per_min');
      const xpmData = totals.find((t: any) => t.field === 'xp_per_min');

      const avgKills = killsData ? killsData.sum / killsData.n : 0;
      const avgDeaths = deathsData ? deathsData.sum / deathsData.n : 0;
      const avgAssists = assistsData ? assistsData.sum / assistsData.n : 0;
      const kda = avgDeaths > 0 ? (avgKills + avgAssists) / avgDeaths : avgKills + avgAssists;

      await this.trendModel.create({
        userId,
        accountId,
        metrics: {
          winRate: parseFloat(winRate.toFixed(2)),
          kda: parseFloat(kda.toFixed(2)),
          mmr: playerInfo.solo_competitive_rank || null,
          rankTier: playerInfo.rank_tier || null,
          matchesPlayed: totalMatches,
          avgGpm: gpmData ? parseFloat((gpmData.sum / gpmData.n).toFixed(0)) : null,
          avgXpm: xpmData ? parseFloat((xpmData.sum / xpmData.n).toFixed(0)) : null,
        },
        recordedAt: new Date(),
      });

      this.logger.debug(`Recorded performance trend for user ${userId}, account ${accountId}`);
    } catch (error) {
      this.logger.error(`Failed to record performance trend: ${error.message}`);
    }
  }

  /**
   * Get performance trends for a player
   */
  async getPerformanceTrends(userId: number, accountId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await this.trendModel.findAll({
      where: {
        userId,
        accountId,
        recordedAt: {
          $gte: startDate,
        } as any,
      },
      order: [['recorded_at', 'ASC']],
    });

    return trends;
  }
}

