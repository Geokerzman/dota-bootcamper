const axios = require('axios');

const BASE_URL = 'https://api.opendota.com/api';

const getPlayerSummaries = async (accountId) => {
    try {
        const response = await axios.get(`${BASE_URL}/players/${accountId}`);
        return response.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

const getMatchHistory = async (accountId) => {
    try {
        const response = await axios.get(`${BASE_URL}/players/${accountId}/matches`);
        return response.data;
    } catch (err) {
        console.error(err.message);
        return [];
    }
};

const getMatchDetail = async (matchId) => {
    try {
        const response = await axios.get(`${BASE_URL}/matches/${matchId}`);
        return response.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

module.exports = { getPlayerSummaries, getMatchHistory , getMatchDetail };
