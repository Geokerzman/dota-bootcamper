const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/recentpromatches
// @desc     Get recent professional matches information
// @access   Public
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.opendota.com/api/proMatches');

        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
        }

        const formattedMatches = response.data.map(match => ({
            matchId: match.match_id,
            duration: match.duration,
            startTime: match.start_time,
            radiantTeam: match.radiant_name || 'Unknown Team',
            direTeam: match.dire_name || 'Unknown Team',
            league: match.league_name || 'Unknown League',
            radiantScore: match.radiant_score,
            direScore: match.dire_score,
            radiantWin: match.radiant_win
        }));

        res.json(formattedMatches);
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
