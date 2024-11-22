const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/proPlayers
// @desc     Get proPlayers list
// @access   Public
router.get('/', async (req, res) => {


    try {
        const response = await axios.get(`https://api.opendota.com/api/proPlayers`);

        console.log('API Response:', response.data);

        if (!response.data) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
        }

        const proPlayers = {
                account_id: response.data.account_id,
                personaname: response.data.personaname,
                name: response.data.name,
                steamid: response.data.steamid,
                avatarmedium: response.data.avatarmedium,
                last_login: response.data.last_login,
                profileurl: response.data.profileurl,
                team_id:response.data.team_id,
                team_name: response.data.team_name,
        };

        res.json([proPlayers]); // Return as an array to match the client-side expectations
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
