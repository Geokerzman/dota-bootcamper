const express = require('express');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/database');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Connect to the database
// connectDB();

// Middleware



app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/steam', authMiddleware, require('./routes/steamRoutes'));
app.use('/api/matches', authMiddleware, require('./routes/matchRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes')); // Correctly connect leaderboard routes
app.use('/api/matchdetails', authMiddleware, require('./routes/matchDetailRoutes'));

// Sync database models
// sequelize.sync()
//     .then(() => console.log('Database synchronized'))
//     .catch((err) => console.error('Error syncing database:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));