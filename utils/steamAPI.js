const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = 'https://api.steampowered.com';

const getPlayerSummaries = async (steamid) => {
    try {
        const response = await axios.get(`${BASE_URL}/ISteamUser/GetPlayerSummaries/v2/`, {
            params: {
                key: STEAM_API_KEY,
                steamids: steamid,
            },
        });
        return response.data.response.players[0];
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

const getMatchHistory = async (account_id) => {
    try {
        const response = await axios.get(`${BASE_URL}/IDOTA2Match_570/GetMatchHistory/v1/`, {
            params: {
                key: STEAM_API_KEY,
                account_id,
            },
        });
        return response.data.result.matches;
    } catch (err) {
        console.error(err.message);
        return [];
    }
};

module.exports = { getPlayerSummaries, getMatchHistory };
