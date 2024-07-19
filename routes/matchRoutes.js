const express = require('express');
const { getMatchHistory } = require('../utils/steamApi');
const User = require('../models/user');
const router = express.Router();

// @route    GET api/matches
// @desc     Get match history for the logged-in user
// @access   Private
router.get('/', async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const matches = await getMatchHistory(user.account_id);

        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
