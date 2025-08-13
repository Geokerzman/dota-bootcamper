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

        const playerInfo = {
            solo_competitive_rank: data.solo_competitive_rank,
            competitive_rank: data.competitive_rank,
            rank_tier: data.rank_tier,
            leaderboard_rank: data.leaderboard_rank,
            profile: {
                account_id: data.profile.account_id,
                personaname: data.profile.personaname,
                name: data.profile.name,
                steamid: data.profile.steamid,
                avatarmedium: data.profile.avatarmedium,
                last_login: data.profile.last_login,
                profileurl: data.profile.profileurl,
            },
        };

        res.json([playerInfo]);
    } catch (err) {
        console.error('Error fetching player info:', err.message);
        res.status(500).send('Server error');
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
