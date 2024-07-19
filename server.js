const express = require('express');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/database');
const authMiddleware = require('./middleware/authMiddleware');

// Load config
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/steam', authMiddleware, require('./routes/steamRoutes'));
app.use('/api/matches', authMiddleware, require('./routes/matchRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/matchdetails', authMiddleware, require('./routes/matchDetailRoutes'));

// Sync database models
sequelize.sync();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
