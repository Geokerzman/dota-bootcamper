const express = require('express');
const openDotaService = require('../services/openDotaService');
const router = express.Router();

// @route    GET api/playerinfo
router.get('/', async (req, res) => {
    const { account_id } = req.query;

    if (!account_id) {
        return res.status(400).json({ msg: 'Account ID is required' });
    }

    try {
        const data = await openDotaService.fetchPlayerInfo(account_id);

        if (!data || !data.profile) {
            return res.status(404).json({ msg: 'Player not found or profile is private' });
        }

        const profile = data.profile || {};
        const playerInfo = {
            solo_competitive_rank: data.solo_competitive_rank ?? null,
            competitive_rank: data.competitive_rank ?? null,
            rank_tier: data.rank_tier ?? null,
            leaderboard_rank: data.leaderboard_rank ?? null,
            profile: {
                account_id: profile.account_id ?? null,
                personaname: profile.personaname ?? null,
                name: profile.name ?? null,
                steamid: profile.steamid ?? null,
                avatarmedium: profile.avatarmedium ?? null,
                last_login: profile.last_login ?? null,
                profileurl: profile.profileurl ?? null,
            },
        };

        res.json([playerInfo]);
    } catch (err) {
        const status = err.response?.status || 500;
        const errorData = err.response?.data || err.message;
        console.error('Error fetching player info:', status, errorData);
        res.status(status).json({ message: 'Failed to fetch player info', error: errorData });
    }
});

// Другие маршруты:
router.get('/totals', async (req, res) => {
    const { account_id, ...query } = req.query;

    if (!account_id) {
        return res.status(400).json({ msg: 'Account ID is required' });
    }

    try {
        const totals = await openDotaService.fetchPlayerTotals(account_id, query);
        res.json(totals);
    } catch (err) {
        console.error('Error fetching totals:', err.message);
        res.status(500).send('Server error');
    }
});

router.get('/counts', async (req, res) => {
    const { account_id, ...query } = req.query;

    if (!account_id) {
        return res.status(400).json({ msg: 'Account ID is required' });
    }

    try {
        const counts = await openDotaService.fetchPlayerCounts(account_id, query);
        res.json(counts);
    } catch (err) {
        console.error('Error fetching counts:', err.message);
        res.status(500).send('Server error');
    }
});

router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ msg: 'Search query (q) is required' });
    }

    try {
        const players = await openDotaService.searchPlayers(q);
        res.json(players);
    } catch (err) {
        console.error('Error searching players:', err.message);
        res.status(500).send('Server error');
    }
});

router.get('/histograms', async (req, res) => {
    const { account_id, field, ...query } = req.query;

    if (!account_id || !field) {
        return res.status(400).json({ msg: 'Account ID and field are required' });
    }

    try {
        const histograms = await openDotaService.fetchHistogram(account_id, field, query);
        res.json(histograms);
    } catch (err) {
        console.error('Error fetching histograms:', err.message);
        res.status(500).send('Server error');
    }
});

// Aggregated overview endpoint
router.get('/overview', async (req, res) => {
    const { account_id } = req.query;
    if (!account_id) {
        return res.status(400).json({ msg: 'Account ID is required' });
    }
    try {
        const data = await openDotaService.fetchOverview(account_id);
        res.json(data);
    } catch (err) {
        const status = err.response?.status || 500;
        res.status(status).json({ message: 'Failed to fetch overview', error: err.message });
    }
});

module.exports = router;