const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/proPlayers
// @desc     Get proPlayers list
// @access   Public
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.opendota.com/api/proPlayers');

        if (!Array.isArray(response.data) || response.data.length === 0) {
            console.error('No data returned from OpenDota API');
            return res.status(404).json({ message: 'No pro players found' });
        }

        // Transform and filter the data
        const proPlayers = response.data.map(player => ({
            account_id: player.account_id,
            personaname: player.personaname || 'N/A',
            name: player.name || 'N/A',
            steamid: player.steamid,
            avatarmedium: player.avatarmedium || '',
            last_login: player.last_login || 'N/A',
            profileurl: player.profileurl,
            team_id: player.team_id || 'N/A',
            team_name: player.team_name || 'N/A',
        }));

        res.json(proPlayers); // Send transformed data
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
