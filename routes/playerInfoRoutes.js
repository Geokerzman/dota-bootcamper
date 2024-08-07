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

module.exports = router;
