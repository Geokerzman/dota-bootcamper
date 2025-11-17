import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

const OPEN_DOTA_API_BASE_URL = 'https://api.opendota.com/api';
const CACHE_TTL_HOURS = 24;

@Injectable()
export class OpenDotaService {
  private readonly logger = new Logger(OpenDotaService.name);

  /**
   * Check if cached data is still valid (less than 24 hours old)
   */
  isCacheValid(lastUpdated: Date): boolean {
    const now = new Date();
    const diffInHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    return diffInHours < CACHE_TTL_HOURS;
  }

  /**
   * Handle API errors consistently
   */
  private handleApiError(error: AxiosError, context: string): never {
    if (error.response) {
      this.logger.error(
        `${context} - API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
      );
      throw new HttpException(
        {
          message: `OpenDota API error: ${error.response.statusText}`,
          statusCode: error.response.status,
          error: error.response.data,
        },
        error.response.status,
      );
    } else if (error.request) {
      this.logger.error(`${context} - No response from OpenDota API`);
      throw new HttpException(
        {
          message: 'Unable to reach OpenDota API',
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      this.logger.error(`${context} - Error: ${error.message}`);
      throw new HttpException(
        {
          message: 'An unexpected error occurred',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchPlayerInfo(accountId: string) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}`;
      this.logger.debug(`Fetching player info for account_id: ${accountId}`);
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchPlayerInfo(${accountId})`);
    }
  }

  async fetchPlayerTotals(accountId: string, queryParams: any = {}) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/totals`;
      const { data } = await axios.get(url, { params: queryParams });
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchPlayerTotals(${accountId})`);
    }
  }

  async fetchPlayerCounts(accountId: string, queryParams: any = {}) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/counts`;
      const { data } = await axios.get(url, { params: queryParams });
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchPlayerCounts(${accountId})`);
    }
  }

  async searchPlayers(query: string) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/search`;
      const { data } = await axios.get(url, { params: { q: query } });
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `searchPlayers(${query})`);
    }
  }

  async fetchHistogram(accountId: string, field: string, queryParams: any = {}) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/histograms/${field}`;
      const { data } = await axios.get(url, { params: queryParams });
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchHistogram(${accountId}, ${field})`);
    }
  }

  async fetchWinLoss(accountId: string) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/wl`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchWinLoss(${accountId})`);
    }
  }

  async fetchRecentMatches(accountId: string, limit: number = 20) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/recentMatches`;
      const { data } = await axios.get(url, { params: { limit } });
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchRecentMatches(${accountId})`);
    }
  }

  async fetchHeroes(accountId: string) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/heroes`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchHeroes(${accountId})`);
    }
  }

  async fetchPeers(accountId: string) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/peers`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchPeers(${accountId})`);
    }
  }

  async fetchRatings(accountId: string) {
    try {
      const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/ratings`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `fetchRatings(${accountId})`);
    }
  }

  async fetchOverview(accountId: string) {
    const [profile, wl, recentMatches, heroes, peers, totals, counts, ratings] = await Promise.all([
      this.fetchPlayerInfo(accountId),
      this.fetchWinLoss(accountId),
      this.fetchRecentMatches(accountId, 20),
      this.fetchHeroes(accountId),
      this.fetchPeers(accountId),
      this.fetchPlayerTotals(accountId),
      this.fetchPlayerCounts(accountId),
      this.fetchRatings(accountId),
    ]);
    return { profile, wl, recentMatches, heroes, peers, totals, counts, ratings };
  }

  async getPlayerSummaries(accountId: string) {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/players/${accountId}`);
      return response.data;
    } catch (error) {
      this.logger.warn(`getPlayerSummaries(${accountId}) failed: ${(error as AxiosError).message}`);
      return null;
    }
  }

  async getMatchHistory(accountId: string) {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/players/${accountId}/matches`);
      return response.data;
    } catch (error) {
      this.logger.warn(`getMatchHistory(${accountId}) failed: ${(error as AxiosError).message}`);
      return [];
    }
  }

  async getMatchDetail(matchId: string) {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/matches/${matchId}`);
      return response.data;
    } catch (error) {
      this.logger.warn(`getMatchDetail(${matchId}) failed: ${(error as AxiosError).message}`);
      return null;
    }
  }

  async getMatchData(matchId: string) {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/matches/${matchId}`);
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError, `getMatchData(${matchId})`);
    }
  }

  async getHeroes() {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/heroes`);
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError, 'getHeroes()');
    }
  }

  async getLiveGames() {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/live`);
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError, 'getLiveGames()');
    }
  }

  async getProPlayers() {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/proPlayers`);
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError, 'getProPlayers()');
    }
  }

  async getPublicMatches() {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/publicMatches`);
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError, 'getPublicMatches()');
    }
  }

  async getProMatches() {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/proMatches`);
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError, 'getProMatches()');
    }
  }
}

