const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET /api/match/:match_id
// @desc     Get detailed match information
// @access   Public
router.get('/:match_id', async (req, res) => {
    const matchId = req.params.match_id;

    try {
        const response = await axios.get(`https://api.opendota.com/api/matches/${matchId}`);

        if (response.status !== 200) {
            return res.status(response.status).send('Error fetching match data from OpenDota API');
        }

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
