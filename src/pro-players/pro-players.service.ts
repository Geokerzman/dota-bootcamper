import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class ProPlayersService {
  private readonly logger = new Logger(ProPlayersService.name);

  constructor(private openDotaService: OpenDotaService) {}

  async getProPlayers() {
    this.logger.debug('Fetching pro players list');
    try {
      const players = await this.openDotaService.getProPlayers();

      if (!Array.isArray(players) || players.length === 0) {
        throw new NotFoundException('No pro players found');
      }

      const proPlayers = players.map((player) => ({
        account_id: player.account_id,
        personaname: player.personaname || 'N/A',
        name: player.name || 'N/A',
        steamid: player.steamid,
        avatarmedium: player.avatarmedium || '',
        last_login: player.last_login || 'N/A',
        profileurl: player.profileurl,
        team_id: player.team_id || 'N/A',
        team_name: player.team_name || 'N/A',
      }));

      this.logger.debug(`Retrieved ${proPlayers.length} pro players`);
      return proPlayers;
    } catch (error) {
      this.logger.error(`Failed to fetch pro players: ${error.message}`);
      throw error;
    }
  }
}

