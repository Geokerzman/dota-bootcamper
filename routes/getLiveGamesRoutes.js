const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/live
// @desc     Get a list of live games
// @access   Public
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.opendota.com/api/live');

        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
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
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
