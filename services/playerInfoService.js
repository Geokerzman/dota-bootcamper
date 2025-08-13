const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/playerinfo
// @desc     Get player information by account ID
// @access   Public
router.get('/', async (req, res) => {
    const { account_id } = req.query;

    if (!account_id) {
        return res.status(400).json({ msg: 'Account ID is required' });
    }

    try {
        const response = await axios.get(`https://api.opendota.com/api/players/${account_id}`);

        console.log('API Response:', response.data);

        if (!response.data) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
        }

        const playerInfo = {
            solo_competitive_rank: response.data.solo_competitive_rank,
            competitive_rank: response.data.competitive_rank,
            rank_tier: response.data.rank_tier,
            leaderboard_rank: response.data.leaderboard_rank,
            profile: {
                account_id: response.data.profile.account_id,
                personaname: response.data.profile.personaname,
                name: response.data.profile.name,
                steamid: response.data.profile.steamid,
                avatarmedium: response.data.profile.avatarmedium,
                last_login: response.data.profile.last_login,
                profileurl: response.data.profile.profileurl,
            }
        };

        res.json([playerInfo]); // Return as an array to match the client-side expectations
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/playerinfo/totals
// @desc     Get player totals by account ID
// @access   Public
router.get('/totals', async (req, res) => {
    console.log('Request for /totals received');
    const { account_id, ...query } = req.query;

    if (!account_id) {
        return res.status(400).json({ msg: 'Account ID is required' });
    }

    try {
        const response = await axios.get(`https://api.opendota.com/api/players/${account_id}/totals`, {
            params: query
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching totals:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});


// @route    GET api/playerinfo/counts
// @desc     Get player counts by account ID
// @access   Public
router.get('/counts', async (req, res) => {
    const { account_id, ...query } = req.query;

    if (!account_id) {
        return res.status(400).json({ msg: 'Account ID is required' });
    }

    try {
        const response = await axios.get(`https://api.opendota.com/api/players/${account_id}/counts`, {
            params: query
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching counts:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/playerinfo/search
// @desc     Search players by personaname
// @access   Public
router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ msg: 'Search query (q) is required' });
    }

    try {
        const response = await axios.get(`https://api.opendota.com/api/search`, {
            params: { q }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error searching players:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});


// @route    GET api/playerinfo/histograms
// @desc     Get player histograms by account ID and field
// @access   Public
router.get('/histograms', async (req, res) => {
    const { account_id, field, ...query } = req.query;

    if (!account_id || !field) {
        return res.status(400).json({ msg: 'Account ID and field are required' });
    }

    try {
        // Изменение URL для гистограмм
        const response = await axios.get(`https://api.opendota.com/api/players/${account_id}/histograms/${field}`, {
            params: query  // передаем дополнительные параметры, если есть
        });

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching histograms:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;