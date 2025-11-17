import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class PlayerService {
  constructor(private openDotaService: OpenDotaService) {}

  async getPlayerInfo(accountId: string) {
    try {
      const data = await this.openDotaService.fetchPlayerInfo(accountId);

      if (!data || !data.profile) {
        throw new NotFoundException('Player not found or profile is private');
      }

      const profile = data.profile || {};
      const playerInfo = {
        solo_competitive_rank: data.solo_competitive_rank ?? null,
        competitive_rank: data.competitive_rank ?? null,
        rank_tier: data.rank_tier ?? null,
        leaderboard_rank: data.leaderboard_rank ?? null,
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
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new NotFoundException('Failed to fetch player info');
    }
  }

  async getTotals(accountId: string, query: any) {
    const totals = await this.openDotaService.fetchPlayerTotals(accountId, query);
    return totals;
  }

  async getCounts(accountId: string, query: any) {
    const counts = await this.openDotaService.fetchPlayerCounts(accountId, query);
    return counts;
  }

  async searchPlayers(query: string) {
    const players = await this.openDotaService.searchPlayers(query);
    return players;
  }

  async getHistograms(accountId: string, field: string, query: any) {
    const histograms = await this.openDotaService.fetchHistogram(accountId, field, query);
    return histograms;
  }

  async getOverview(accountId: string) {
    const data = await this.openDotaService.fetchOverview(accountId);
    return data;
  }
}

