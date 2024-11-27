const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL для OpenDota API
const OPEN_DOTA_API_BASE_URL = 'https://api.opendota.com/api';

/**
 * @route GET /api/live
 * @desc  Get a list of live games
 * @access Public
 */
router.get('/live', async (req, res) => {
    try {
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/live`);
        if (!Array.isArray(response.data)) {
            return res.status(500).json({ error: 'Unexpected response format from OpenDota API' });
        }

        const liveGames = response.data.map(liveMatch => ({
            match_id: liveMatch.match_id,
            league_id: liveMatch.league_id,
            league_name: liveMatch.league_name,
            spectators: liveMatch.spectators,
            radiant_team: liveMatch.radiant_team,
            dire_team: liveMatch.dire_team,
            scoreboard: liveMatch.scoreboard
        }));

        res.json(liveGames);
    } catch (err) {
        console.error('Error fetching live games:', err.message);
        res.status(500).json({ error: 'Failed to fetch live games' });
    }
});

/**
 * @route GET /api/scenarios/itemTimings
 * @desc  Get win rates for certain item timings
 * @access Public
 * @query item (string) - Filter by item name
 * @query hero_id (integer) - Filter by hero ID
 */
router.get('/scenarios/itemTimings', async (req, res) => {
    const { item, hero_id } = req.query;

    try {
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/scenarios/itemTimings`, {
            params: { item, hero_id }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching item timings:', err.message);
        res.status(500).json({ error: 'Failed to fetch item timings' });
    }
});

/**
 * @route GET /api/scenarios/laneRoles
 * @desc  Get win rates for heroes in certain lane roles
 * @access Public
 * @query lane_role (string) - Filter by lane role (1-4)
 * @query hero_id (integer) - Filter by hero ID
 */
router.get('/scenarios/laneRoles', async (req, res) => {
    const { lane_role, hero_id } = req.query;

    try {
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/scenarios/laneRoles`, {
            params: { lane_role, hero_id }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching lane roles:', err.message);
        res.status(500).json({ error: 'Failed to fetch lane roles' });
    }
});

/**
 * @route GET /api/scenarios/misc
 * @desc  Get miscellaneous team scenarios
 * @access Public
 * @query scenario (string) - Name of the scenario
 */
router.get('/scenarios/misc', async (req, res) => {
    const { scenario } = req.query;

    try {
        const response = await axios.get(`${OPEN_DOTA_API_BASE_URL}/scenarios/misc`, {
            params: { scenario }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching miscellaneous scenarios:', err.message);
        res.status(500).json({ error: 'Failed to fetch miscellaneous scenarios' });
    }
});

module.exports = router;
