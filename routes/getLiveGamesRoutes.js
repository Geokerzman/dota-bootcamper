const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPEN_DOTA_API_BASE_URL = 'https://api.opendota.com/api';

// Кэш для героев и игроков
let heroCache = null;
const playerCache = {};

// Функция для получения списка героев с кэшированием
async function getHeroes() {
    if (!heroCache) {
        console.log('Fetching heroes from OpenDota API...');
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/heroes`);
        heroCache = response.data;
    }
    return heroCache;
}

// Функция для получения профиля игрока с кэшированием
async function getPlayerProfile(accountId) {
    if (!accountId) return null;
    if (playerCache[accountId]) return playerCache[accountId];

    try {
        console.log(`Fetching profile for player: ${accountId}`);
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/players/${accountId}`);
        const profile = response.data.profile;
        playerCache[accountId] = profile; // Кэшируем профиль игрока
        return profile;
    } catch (err) {
        console.warn(`Failed to fetch profile for player ${accountId}: ${err.message}`);
        return null;
    }
}

/**
 * @route GET /api/live
 * @desc Get detailed information about 3 random live matches
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        console.log('Fetching live matches from OpenDota API...');
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/live`);
        const liveMatches = response.data;

        console.log(`Total live matches fetched: ${liveMatches.length}`);

        if (!Array.isArray(liveMatches) || liveMatches.length === 0) {
            console.warn('No live matches found.');
            return res.status(404).json({ error: 'No live matches found' });
        }

        // Выбираем только 3 случайных матча
        const shuffledMatches = liveMatches.sort(() => 0.5 - Math.random());
        const randomMatches = shuffledMatches.slice(0, 3);

        console.log(`Random matches selected: ${randomMatches.map(match => match.match_id).join(', ')}`);

        // Получаем кэшированный список героев
        const heroes = await getHeroes();

        // Обрабатываем данные для каждого матча
        const matchDetails = await Promise.all(randomMatches.map(async (match) => {
            // Отбираем только первых 5 игроков каждой команды
            const players = await Promise.all(
                match.players.slice(0, 5).map(async (player) => {
                    const hero = heroes.find(h => h.id === player.hero_id);
                    const profile = await getPlayerProfile(player.account_id); // Получаем профиль игрока

                    return {
                        account_id: player.account_id || null,
                        name: player.name || 'Anonymous',
                        hero_name: hero ? hero.localized_name : 'Unknown Hero',
                        hero_id: player.hero_id || null,
                        team: player.team === 0 ? 'Radiant' : 'Dire',
                        kills: player.kills || 0,
                        deaths: player.deaths || 0,
                        assists: player.assists || 0,
                        is_pro: player.is_pro || false,
                        team_name: player.team_name || 'N/A',
                        avatar: profile ? profile.avatarfull : 'https://example.com/default-avatar.png',
                    };
                })
            );

            return {
                match_id: match.match_id,
                spectators: match.spectators || 0,
                radiant_team: match.team_name_radiant || 'Unknown',
                dire_team: match.team_name_dire || 'Unknown',
                radiant_score: match.radiant_score || 0,
                dire_score: match.dire_score || 0,
                players
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
