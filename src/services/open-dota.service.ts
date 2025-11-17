import { Injectable } from '@nestjs/common';
import axios from 'axios';

const OPEN_DOTA_API_BASE_URL = 'https://api.opendota.com/api';

@Injectable()
export class OpenDotaService {
  async fetchPlayerInfo(accountId: string) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}`;
    const { data } = await axios.get(url);
    return data;
  }

  async fetchPlayerTotals(accountId: string, queryParams: any = {}) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/totals`;
    const { data } = await axios.get(url, { params: queryParams });
    return data;
  }

  async fetchPlayerCounts(accountId: string, queryParams: any = {}) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/counts`;
    const { data } = await axios.get(url, { params: queryParams });
    return data;
  }

  async searchPlayers(query: string) {
    const url = `${OPEN_DOTA_API_BASE_URL}/search`;
    const { data } = await axios.get(url, { params: { q: query } });
    return data;
  }

  async fetchHistogram(accountId: string, field: string, queryParams: any = {}) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/histograms/${field}`;
    const { data } = await axios.get(url, { params: queryParams });
    return data;
  }

  async fetchWinLoss(accountId: string) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/wl`;
    const { data } = await axios.get(url);
    return data;
  }

  async fetchRecentMatches(accountId: string, limit: number = 20) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/recentMatches`;
    const { data } = await axios.get(url, { params: { limit } });
    return data;
  }

  async fetchHeroes(accountId: string) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/heroes`;
    const { data } = await axios.get(url);
    return data;
  }

  async fetchPeers(accountId: string) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/peers`;
    const { data } = await axios.get(url);
    return data;
  }

  async fetchRatings(accountId: string) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/ratings`;
    const { data } = await axios.get(url);
    return data;
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
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  async getMatchHistory(accountId: string) {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/players/${accountId}/matches`);
      return response.data;
    } catch (err) {
      console.error(err.message);
      return [];
    }
  }

  async getMatchDetail(matchId: string) {
    try {
      const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/matches/${matchId}`);
      return response.data;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  async getMatchData(matchId: string) {
    const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/matches/${matchId}`);
    return response.data;
  }

  async getHeroes() {
    const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/heroes`);
    return response.data;
  }

  async getLiveGames() {
    const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/live`);
    return response.data;
  }

  async getProPlayers() {
    const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/proPlayers`);
    return response.data;
  }

  async getPublicMatches() {
    const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/publicMatches`);
    return response.data;
  }

  async getProMatches() {
    const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/proMatches`);
    return response.data;
  }
}

