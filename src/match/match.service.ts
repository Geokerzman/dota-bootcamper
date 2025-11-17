import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OpenDotaService } from '../services/open-dota.service';
import { User } from '../models/user.model';
import { generateRecommendations } from '../utils/recommendations';

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private openDotaService: OpenDotaService,
  ) {}

  async getMatchHistory(userId: number) {
    this.logger.debug(`Fetching match history for user_id: ${userId}`);
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.account_id) {
      throw new NotFoundException('User account_id not found. Please link your Steam account first.');
    }

    try {
      const matches = await this.openDotaService.getMatchHistory(user.account_id.toString());
      this.logger.debug(`Retrieved ${matches.length} matches for user_id: ${userId}`);
      return matches;
    } catch (error) {
      this.logger.error(`Failed to fetch match history for user_id ${userId}: ${error.message}`);
      throw error;
    }
  }

  async getMatchDetails(matchId: string) {
    this.logger.debug(`Fetching match details for match_id: ${matchId}`);
    
    try {
      const matchDetails = await this.openDotaService.getMatchDetail(matchId);

      if (!matchDetails) {
        throw new NotFoundException('Match not found');
      }

      const recommendations = await generateRecommendations(matchDetails);
      this.logger.debug(`Match details retrieved successfully for match_id: ${matchId}`);

      return { matchDetails, recommendations };
    } catch (error) {
      this.logger.error(`Failed to fetch match details for match_id ${matchId}: ${error.message}`);
      throw error;
    }
  }

  async getMatchData(matchId: string) {
    this.logger.debug(`Fetching match data for match_id: ${matchId}`);
    try {
      const matchData = await this.openDotaService.getMatchData(matchId);
      return matchData;
    } catch (error) {
      this.logger.error(`Failed to fetch match data for match_id ${matchId}: ${error.message}`);
      throw error;
    }
  }

  async getRecentMatches() {
    this.logger.debug('Fetching recent public matches');
    try {
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

      this.logger.debug(`Retrieved ${recentMatches.length} recent matches`);
      return recentMatches;
    } catch (error) {
      this.logger.error(`Failed to fetch recent matches: ${error.message}`);
      throw error;
    }
  }

  async getRecentProMatches() {
    this.logger.debug('Fetching recent pro matches');
    try {
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

      this.logger.debug(`Retrieved ${proMatches.length} recent pro matches`);
      return proMatches;
    } catch (error) {
      this.logger.error(`Failed to fetch recent pro matches: ${error.message}`);
      throw error;
    }
  }
}

