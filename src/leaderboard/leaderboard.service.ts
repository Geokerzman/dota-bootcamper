import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(private openDotaService: OpenDotaService) {}

  async getLeaderboard() {
    this.logger.debug('Fetching leaderboard data');
    try {
      const players = await this.openDotaService.getProPlayers();

      if (!Array.isArray(players)) {
        throw new BadRequestException('Unexpected response format from OpenDota API');
      }

      const formattedPlayers = players.map((player) => ({
        username: player.name,
        team: player.team_name || 'Unknown Team',
        profileurl: `https://www.opendota.com/players/${player.account_id}`,
        avatar: player.avatarfull,
      }));

      this.logger.debug(`Retrieved ${formattedPlayers.length} leaderboard entries`);
      return formattedPlayers;
    } catch (error) {
      this.logger.error(`Failed to fetch leaderboard: ${error.message}`);
      throw error;
    }
  }
}

