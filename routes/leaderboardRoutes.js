const express = require('express');
const User = require('../models/user');
const router = express.Router();

// @route    GET api/leaderboard
// @desc     Get top players by MMR
// @access   Public
router.get('/', async (req, res) => {
    try {
        const topPlayers = await User.findAll({
            order: [['mmr', 'DESC']],
            limit: 10,
            attributes: ['username', 'mmr', 'profileurl', 'avatar'],
        });

        res.json(topPlayers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
