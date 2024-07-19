const express = require('express');
const { getPlayerSummaries, getMatchHistory } = require('../utils/steamApi');
const User = require('../models/user');
const router = express.Router();

// @route    POST api/steam/link
// @desc     Link Steam account to user
// @access   Private
router.post('/link', async (req, res) => {
    const { steamid } = req.body;

    try {
        const player = await getPlayerSummaries(steamid);

        if (!player) {
            return res.status(400).json({ msg: 'Invalid Steam ID' });
        }

        const user = await User.findByPk(req.user.id);

        user.steamid = steamid;
        user.profileurl = player.profileurl;
        user.avatar = player.avatar;
        user.account_id = player.account_id;
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router
