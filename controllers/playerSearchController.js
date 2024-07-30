const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.opendota.com/api/players/{account_id}');

        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
        }

        const playerData = response.data.map(player => ({
            username: player.name,
            team: player.team_name || 'Unknown Team',
            profileurl: `https://www.opendota.com/players/${player.account_id}`,
            avatar: player.avatarfull,
            solo_competitive_rank: player.solo_competitive_rank,
        }));

        res.json(playerData);
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;


//test ID:76561197985291357