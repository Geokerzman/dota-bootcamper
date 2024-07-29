const express = require('express');
const { getMatchDetail } = require('../utils/steamApi');
const { generateRecommendations } = require('../utils/recommendations');
const router = express.Router();

// @route    GET api/matches/:match_id
// @desc     Get match details and recommendations
// @access   Private
router.get('/:match_id', async (req, res) => {
    try {
        const matchId = req.params.match_id;

        const matchDetails = await getMatchDetail(matchId);

        if (!matchDetails) {
            return res.status(404).json({ msg: 'Match not found' });
        }

        const recommendations = await generateRecommendations(matchDetails);

        res.json({ matchDetails, recommendations });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
