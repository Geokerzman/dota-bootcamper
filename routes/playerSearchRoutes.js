const express = require('express');
const { searchPlayers } = require('../controllers/playerSearchController');
const router = express.Router();

// @route    GET api/players/search
// @desc     Search for players by name
// @access   Public
router.get('/search', searchPlayers);