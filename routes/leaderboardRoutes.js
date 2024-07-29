// const express = require('express');
// const User = require('../models/user');
// const router = express.Router();
//
// // @route    GET api/leaderboard
// // @desc     Get top players by MMR
// // @access   Public
// router.get('/', async (req, res) => {
//     try {
//         const topPlayers = await User.findAll({
//             order: [['mmr', 'DESC']],
//             limit: 10,
//             attributes: ['username', 'mmr', 'profileurl', 'avatar'],
//         });
//
//         res.json(topPlayers);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });
//
// module.exports = router;

//New approach

const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/leaderboard
// @desc     Get professional players' information
// @access   Public
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.opendota.com/api/proPlayers');

        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
        }

        const formattedPlayers = response.data.map(player => ({
            username: player.name,
            team: player.team_name || 'Unknown Team',
            profileurl: `https://www.opendota.com/players/${player.account_id}`,
            avatar: player.avatarfull,
        }));

        res.json(formattedPlayers);
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;


