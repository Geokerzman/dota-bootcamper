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

module.exports = {
    fetchPlayerInfo,
    fetchPlayerTotals,
    fetchPlayerCounts,
    searchPlayers,
    fetchHistogram,
};


