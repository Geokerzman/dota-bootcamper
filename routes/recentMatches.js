const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/recentmatches
// @desc     Get recent ordinary matches information
// @access   Public
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.opendota.com/api/publicMatches');

        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
        }

        const recentMatches = response.data.map(match => ({
            matchId: match.match_id,
            duration: match.duration,
            startTime: match.start_time,
            radiantTeam: match.radiant_name || 'Unknown Team',
            direTeam: match.dire_name || 'Unknown Team',
            radiantWin: match.radiant_win,
            game_mode: match.game_mode,
            avg_rank_tier: match.avg_rank_tier,
            num_rank_tier: match.num_rank_tier,
        }));

        res.json(recentMatches);
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
