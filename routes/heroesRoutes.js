const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route    GET api/heroesRoutes
// @desc     Get heroes info
// @access   Public
router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.opendota.com/api/heroes');

        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('Unexpected response format:', response.data);
            return res.status(500).send('Unexpected response format from OpenDota API');
        }

        const heroesInfo = response.data.map(hero => ({
            id: hero.id,
            name: hero.name,
            localized_name: hero.localized_name,
            primary_attr: hero.primary_attr,
            attack_type: hero.attack_type,
            roles:hero.roles,
        }));

        res.json(heroesInfo);
    } catch (err) {
        console.error('Error fetching data from OpenDota API:', err.response ? err.response.data : err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
