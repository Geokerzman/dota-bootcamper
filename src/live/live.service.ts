import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class LiveService {
  private readonly logger = new Logger(LiveService.name);
  private heroCache: any = null;
  private playerCache: Record<string, any> = {};

  constructor(private openDotaService: OpenDotaService) {}

  private async getHeroes() {
    if (!this.heroCache) {
      this.logger.debug('Fetching heroes from OpenDota API for live matches');
      this.heroCache = await this.openDotaService.getHeroes();
    }
    return this.heroCache;
  }

  private async getPlayerProfile(accountId: number) {
    if (!accountId) return null;
    if (this.playerCache[accountId]) {
      this.logger.debug(`Using cached profile for player: ${accountId}`);
      return this.playerCache[accountId];
    }

    try {
      this.logger.debug(`Fetching profile for player: ${accountId}`);
      const profile = await this.openDotaService.fetchPlayerInfo(accountId.toString());
      this.playerCache[accountId] = profile;
      return profile;
    } catch (err) {
      this.logger.warn(`Failed to fetch profile for player ${accountId}: ${err.message}`);
      return null;
    }
  }

  async getLiveGames() {
    this.logger.debug('Fetching live matches from OpenDota API');
    try {
      const liveMatches = await this.openDotaService.getLiveGames();

      this.logger.debug(`Total live matches fetched: ${liveMatches.length}`);

      if (!Array.isArray(liveMatches) || liveMatches.length === 0) {
        this.logger.warn('No live matches found');
        throw new NotFoundException('No live matches found');
      }

      // Select 3 random matches
      const shuffledMatches = liveMatches.sort(() => 0.5 - Math.random());
      const randomMatches = shuffledMatches.slice(0, 3);

      this.logger.debug(
        `Random matches selected: ${randomMatches.map((match) => match.match_id).join(', ')}`,
      );

      // Get cached heroes list
      const heroes = await this.getHeroes();

      // Process data for each match
      const matchDetails = await Promise.all(
        randomMatches.map(async (match) => {
          // Separate players into teams and limit to 5 players each
          const radiantPlayers = match.players.filter((player) => player.team === 0).slice(0, 5);
          const direPlayers = match.players.filter((player) => player.team === 1).slice(0, 5);

          // Process players from both teams
          const players = await Promise.all(
            [...radiantPlayers, ...direPlayers].map(async (player) => {
              const hero = heroes.find((h) => h.id === player.hero_id);
              const profile = await this.getPlayerProfile(player.account_id);

              // Get rank from profile if available
              const rank = profile ? profile.rank_tier : null;
              const formattedRank = rank ? `${Math.floor(rank / 10)}.${rank % 10}` : 'Unranked';

              return {
                account_id: player.account_id || null,
                name: player.name || 'Anonymous',
                hero_name: hero ? hero.localized_name : 'Hero not selected',
                hero_id: player.hero_id || null,
                team: player.team === 0 ? 'Radiant' : 'Dire',
                kills: player.kills != null ? player.kills : 0,
                deaths: player.deaths != null ? player.deaths : 0,
                assists: player.assists != null ? player.assists : 0,
                is_pro: player.is_pro || false,
                team_name: player.team_name || 'N/A',
                avatar:
                  profile && profile.profile
                    ? profile.profile.avatarfull
                    : 'https://example.com/default-avatar.png',
                rank: formattedRank,
              };
            }),
          );

          return {
            match_id: match.match_id,
            spectators: match.spectators || 0,
            radiant_team: match.team_name_radiant || 'Radiant',
            dire_team: match.team_name_dire || 'Dire',
            radiant_score: match.radiant_score || 0,
            dire_score: match.dire_score || 0,
            players,
          };
        }),
      );

      this.logger.debug(`Returning ${matchDetails.length} formatted match details`);
      return matchDetails;
    } catch (error) {
      this.logger.error(`Error fetching live matches: ${error.message}`);
      throw error;
    }
  }
}

