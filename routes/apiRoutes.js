const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/data
// @desc     Get data from OpenDota API based on input
// @access   Public
router.get('/data', async (req, res) => {
    const { match_id } = req.query;

    if (!match_id) {
        return res.status(400).json({ msg: 'Match ID is required' });
    }

    try {
        const response = await axios.get(`https://api.opendota.com/api/matches/${match_id}`);

        if (response.status !== 200) {
            return res.status(response.status).send('Error fetching data from OpenDota API');
        }

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
