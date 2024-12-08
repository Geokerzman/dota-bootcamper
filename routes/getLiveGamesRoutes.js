const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPEN_DOTA_API_BASE_URL = 'https://api.opendota.com/api';

/**
 * @route GET /api/live
 * @desc  Get detailed information about 10 random live matches
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        console.log('Fetching live matches from OpenDota API...');

        // Получаем все текущие матчи
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/live`);
        const liveMatches = response.data;

        console.log(`Total live matches fetched: ${liveMatches.length}`);

        if (!Array.isArray(liveMatches) || liveMatches.length === 0) {
            console.warn('No live matches found.');
            return res.status(404).json({ error: 'No live matches found' });
        }

        // Выбираем случайные 10 матчей
        const shuffledMatches = liveMatches.sort(() => 0.5 - Math.random());
        const randomMatches = shuffledMatches.slice(0, 10);

        console.log(`Random matches selected: ${randomMatches.map(match => match.match_id).join(', ')}`);

        // Форматируем данные для каждого матча
        const matchDetails = await Promise.all(randomMatches.map(async (match) => {
            console.log(`Processing match: ${match.match_id}`);

            // Получаем информацию о игроках для каждого матча
            const playerDetails = await Promise.all(match.players.map(async (player) => {
                const playerResponse = await axios.get(`${OPEN_DOTA_API_BASE_URL}/players/${player.account_id}`);
                const playerData = playerResponse.data;

                // Получаем информацию о герое
                const heroResponse = await axios.get(`${OPEN_DOTA_API_BASE_URL}/heroes`);
                const hero = heroResponse.data.find(h => h.id === player.hero_id);

                return {
                    account_id: player.account_id,
                    name: player.name || 'Anonymous',
                    rank: playerData.rank_tier || 'Unranked',  // Ранг игрока
                    hero_name: hero ? hero.localized_name : 'Unknown Hero',
                    hero_id: player.hero_id || 'Not picked',
                    team: player.team === 0 ? 'Radiant' : 'Dire',
                    kills: player.kills || 0,
                    deaths: player.deaths || 0,
                    assists: player.assists || 0,
                    is_pro: player.is_pro || false,
                    team_name: player.team_name || 'N/A'
                };
            }));

            return {
                match_id: match.match_id,
                spectators: match.spectators || 0,
                radiant_team: match.team_name_radiant || 'Team Radiant',
                dire_team: match.team_name_dire || 'Team Dire',
                radiant_score: match.radiant_score || 0,
                dire_score: match.dire_score || 0,
                players: playerDetails
            };
        }));

        console.log('Returning formatted match details...');
        res.json(matchDetails);
    } catch (err) {
        console.error('Error fetching live matches:', err.message);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

module.exports = router;
