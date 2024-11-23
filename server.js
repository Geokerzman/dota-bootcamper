const express = require('express');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/database');
const authMiddleware = require('./middleware/authMiddleware');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Connect to the database
// connectDB();

// Middleware



app.use(express.json()); // for parsing application/json

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/steam', authMiddleware, require('./routes/steamRoutes'));
app.use('/api/matches', authMiddleware, require('./routes/matchRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/matchdetails', authMiddleware, require('./routes/matchDetailRoutes'));
app.use('/api/match', require('./routes/matchSummary'));
app.use('/api/recentpromatches', require('./routes/recentProMatches'));
app.use('/api/recentmatches', require('./routes/recentMatches'));
app.use('/api/heroes', require('./routes/heroesRoutes'));
app.use('/api/live', require('./routes/getLiveGamesRoutes'));
app.use('/api/playerinfo',require('./routes/playerInfoRoutes'));
app.use('/api/proplayers', require('./routes/proPlayersRoutes'));



app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'player.html'));
});
app.get('/pros', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'proPlayers.html'));
});

// Sync database models
// sequelize.sync()
//     .then(() => console.log('Database synchronized'))
//     .catch((err) => console.error('Error syncing database:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));