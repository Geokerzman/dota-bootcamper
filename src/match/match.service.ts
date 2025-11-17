import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OpenDotaService } from '../services/open-dota.service';
import { User } from '../models/user.model';
import { generateRecommendations } from '../utils/recommendations';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private openDotaService: OpenDotaService,
  ) {}

  async getMatchHistory(userId: number) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.account_id) {
      throw new NotFoundException('User account_id not found');
    }

    const matches = await this.openDotaService.getMatchHistory(user.account_id.toString());
    return matches;
  }

  async getMatchDetails(matchId: string) {
    const matchDetails = await this.openDotaService.getMatchDetail(matchId);

    if (!matchDetails) {
      throw new NotFoundException('Match not found');
    }

    const recommendations = await generateRecommendations(matchDetails);

    return { matchDetails, recommendations };
  }

  async getMatchData(matchId: string) {
    const matchData = await this.openDotaService.getMatchData(matchId);
    return matchData;
  }

  async getRecentMatches() {
    const matches = await this.openDotaService.getPublicMatches();

    if (!Array.isArray(matches)) {
      throw new NotFoundException('Unexpected response format from OpenDota API');
    }

    const recentMatches = matches.map((match) => ({
      matchId: match.match_id,
      duration: match.duration,
      startTime: match.start_time,
      radiantTeam: match.radiant_name || 'Unknown Team',
      direTeam: match.dire_name || 'Unknown Team',
      radiantWin: match.radiant_win,
      game_mode: match.game_mode,
      avg_rank_tier: match.avg_rank_tier,
      num_rank_tier: match.num_rank_tier,
    }));

    return recentMatches;
  }

  async getRecentProMatches() {
    const matches = await this.openDotaService.getProMatches();

    if (!Array.isArray(matches)) {
      throw new NotFoundException('Unexpected response format from OpenDota API');
    }

    const proMatches = matches.map((match) => ({
      matchId: match.match_id,
      duration: match.duration,
      startTime: match.start_time,
      radiantTeam: match.radiant_name || 'Unknown Team',
      direTeam: match.dire_name || 'Unknown Team',
      league: match.league_name || 'Unknown League',
      radiantScore: match.radiant_score,
      direScore: match.dire_score,
      radiantWin: match.radiant_win,
    }));

    return proMatches;
  }
}

