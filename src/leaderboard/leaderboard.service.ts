import { Injectable } from '@nestjs/common';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class LeaderboardService {
  constructor(private openDotaService: OpenDotaService) {}

  async getLeaderboard() {
    const players = await this.openDotaService.getProPlayers();

    if (!Array.isArray(players)) {
      throw new Error('Unexpected response format from OpenDota API');
    }

    const formattedPlayers = players.map((player) => ({
      username: player.name,
      team: player.team_name || 'Unknown Team',
      profileurl: `https://www.opendota.com/players/${player.account_id}`,
      avatar: player.avatarfull,
    }));

    return formattedPlayers;
  }
}

