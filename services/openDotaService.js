const axios = require('axios');

const OPEN_DOTA_API_BASE_URL = 'https://api.opendota.com/api';

async function fetchPlayerInfo(accountId) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}`;
    const { data } = await axios.get(url);
    return data;
}

async function fetchPlayerTotals(accountId, queryParams = {}) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/totals`;
    const { data } = await axios.get(url, { params: queryParams });
    return data;
}

async function fetchPlayerCounts(accountId, queryParams = {}) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/counts`;
    const { data } = await axios.get(url, { params: queryParams });
    return data;
}

async function searchPlayers(query) {
    const url = `${OPEN_DOTA_API_BASE_URL}/search`;
    const { data } = await axios.get(url, { params: { q: query } });
    return data;
}

async function fetchHistogram(accountId, field, queryParams = {}) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/histograms/${field}`;
    const { data } = await axios.get(url, { params: queryParams });
    return data;
}

async function fetchWinLoss(accountId) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/wl`;
    const { data } = await axios.get(url);
    return data;
}

async function fetchRecentMatches(accountId, limit = 20) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/recentMatches`;
    const { data } = await axios.get(url, { params: { limit } });
    return data;
}

async function fetchHeroes(accountId) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/heroes`;
    const { data } = await axios.get(url);
    return data;
}

async function fetchPeers(accountId) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/peers`;
    const { data } = await axios.get(url);
    return data;
}

async function fetchRatings(accountId) {
    const url = `${OPEN_DOTA_API_BASE_URL}/players/${accountId}/ratings`;
    const { data } = await axios.get(url);
    return data;
}

async function fetchOverview(accountId) {
    const [profile, wl, recentMatches, heroes, peers, totals, counts, ratings] = await Promise.all([
        fetchPlayerInfo(accountId),
        fetchWinLoss(accountId),
        fetchRecentMatches(accountId, 20),
        fetchHeroes(accountId),
        fetchPeers(accountId),
        fetchPlayerTotals(accountId),
        fetchPlayerCounts(accountId),
        fetchRatings(accountId),
    ]);
    return { profile, wl, recentMatches, heroes, peers, totals, counts, ratings };
}

module.exports = {
    fetchPlayerInfo,
    fetchPlayerTotals,
    fetchPlayerCounts,
    searchPlayers,
    fetchHistogram,
    fetchWinLoss,
    fetchRecentMatches,
    fetchHeroes,
    fetchPeers,
    fetchRatings,
    fetchOverview,
};


