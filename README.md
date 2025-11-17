# Dota-bootcamper

Dota-bootcamper is a web application designed to provide detailed statistics and insights for Dota 2 players. Using the OpenDota API, the application fetches and displays data such as player information, match history, live games, leaderboards, and hero stats. The backend is built with **NestJS** (TypeScript), and the frontend is powered by React.

---

## Features

### Core Features
- **User Authentication**: Secure login system with JWT tokens for accessing personalized data.
- **Player Statistics**: View player profiles, match history, and detailed match summaries.
- **Live Matches**: Fetch live games data directly from OpenDota.
- **Leaderboards**: Display rankings of top-performing players.
- **Heroes Statistics**: Explore detailed stats for each Dota 2 hero.
- **Player Data Caching**: Smart 24-hour caching system to reduce API calls and improve performance.

### Advanced Features (Beyond Dotabuff)
- **📚 Library System**: Bookmark and organize your favorite players, heroes, and matches in a personal library.
- **⚔️ Player Comparison**: Compare up to 5 players side-by-side with detailed statistics and metrics.
- **🎯 Hero Recommendations**: Get personalized hero recommendations based on your playstyle and performance.
- **📊 Performance Trends**: Track your performance over time with historical data and trend analysis.
- **🔔 Custom Alerts**: Set up alerts for player matches, rank changes, and custom events.
- **📈 Meta Analysis**: View current meta statistics including hero win rates and popular picks.
- **💾 Saved Comparisons**: Save player comparisons for quick access later.
- **📝 Personal Notes**: Add notes to your bookmarked items for personal reference.

---

## Tech Stack

### Backend
- **NestJS**: Progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: Typed superset of JavaScript for better code quality and maintainability.
- **Sequelize**: ORM for database management with TypeScript support.
- **Passport JWT**: Authentication strategy for securing API endpoints.
- **OpenDota API**: Data source for Dota 2 statistics and matches.

### Frontend
- **React**: For creating an interactive and dynamic user interface.
- **Vite**: Fast build tool and dev server for React.

---

## Frontend (React) Development

- Install client dependencies: `npm install --prefix client`
- Run client dev server: `npm run client:dev`
- API requests to `/api/*` are proxied to `http://localhost:5000` via Vite config.

---

## Backend (NestJS) Development

### Development Mode
- Install dependencies: `npm install`
- Run in development mode with hot-reload: `npm run start:dev`
- The server will start on port 5000 (or the port specified in your `.env` file)

### Production Mode
- Build the application: `npm run build`
- Start production server: `npm run start:prod`
- In production (`NODE_ENV=production`), the server serves the React build from `client/dist`.

---

## Build and Serve

1. **Build the frontend**: `npm run client:build`
2. **Build the backend**: `npm run build`
3. **Start the server**: `npm run start:prod`

The server will serve both the API endpoints and the React application in production mode.

---

## Database

- **MySQL** (via Sequelize): Database for storing user and match data.
- The application uses Sequelize ORM with TypeScript models for type-safe database operations.

---

## Main API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: User login (returns JWT token).

### Player Stats
- **GET** `/api/playerinfo`: Fetch player details.
- **GET** `/api/playerinfo/totals`: Get player totals.
- **GET** `/api/playerinfo/counts`: Get player counts.
- **GET** `/api/playerinfo/search?q={query}`: Search for players.
- **GET** `/api/playerinfo/histograms`: Get player histograms.
- **GET** `/api/playerinfo/overview`: Get aggregated player overview.

### Matches
- **GET** `/api/matches`: Retrieve recent matches for authenticated user (requires JWT).
- **GET** `/api/matchdetails/:match_id`: Get detailed match information with recommendations (requires JWT).
- **GET** `/api/match/:match_id`: Get match summary.
- **GET** `/api/recentmatches`: Fetch recent public matches.
- **GET** `/api/recentpromatches`: Fetch recent professional matches.

### Live Games
- **GET** `/api/live`: Retrieve live games (returns 3 random live matches).

### Heroes
- **GET** `/api/heroes`: Fetch statistics for all heroes.

### Leaderboard
- **GET** `/api/leaderboard`: Retrieve leaderboard data (pro players).

### Pro Players
- **GET** `/api/proplayers`: Get list of professional players.

### Steam Integration
- **POST** `/api/steam/link`: Link Steam account to user (requires JWT).

### Library (Favorites/Bookmarks)
- **GET** `/api/library`: Get user's library items (requires JWT).
- **GET** `/api/library?type={player|hero|match}`: Get library items filtered by type (requires JWT).
- **POST** `/api/library`: Add item to library (requires JWT).
  - Body: `{ itemType: 'player'|'hero'|'match', itemId: number, notes?: string }`
- **DELETE** `/api/library/:type/:id`: Remove item from library (requires JWT).
- **PUT** `/api/library/:type/:id/notes`: Update item notes (requires JWT).
- **GET** `/api/library/check/:type/:id`: Check if item is in library (requires JWT).

### Analytics & Comparisons
- **POST** `/api/analytics/compare`: Compare multiple players (requires JWT).
  - Body: `{ accountIds: number[] }` (2-5 players)
- **POST** `/api/analytics/compare/save`: Save comparison for later (requires JWT).
  - Body: `{ comparisonName: string, accountIds: number[] }`
- **GET** `/api/analytics/compare/saved`: Get saved comparisons (requires JWT).
- **GET** `/api/analytics/recommendations/:accountId`: Get hero recommendations for player (requires JWT).
- **GET** `/api/analytics/meta`: Get meta analysis (hero win rates, popular picks).
- **POST** `/api/analytics/trends/record`: Record performance trend snapshot (requires JWT).
  - Body: `{ accountId: number }`
- **GET** `/api/analytics/trends/:accountId?days=30`: Get performance trends (requires JWT).

### Alerts & Notifications
- **POST** `/api/alerts`: Create alert (requires JWT).
  - Body: `{ alertType: 'player_match'|'player_rank_change'|'match_started'|'custom', alertName: string, targetId?: number, conditions?: any }`
- **GET** `/api/alerts`: Get user's alerts (requires JWT).
- **GET** `/api/alerts?status={active|triggered|disabled}`: Get alerts filtered by status (requires JWT).
- **PUT** `/api/alerts/:id`: Update alert (requires JWT).
- **DELETE** `/api/alerts/:id`: Delete alert (requires JWT).

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- MySQL database
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Important**: Make sure to set a strong `JWT_SECRET` for production use.

---

## Installation and Launch

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install client dependencies**:
   ```bash
   npm install --prefix client
   ```

3. **Set up your database**:
   - **Option 1: Using Docker (Recommended)**
     ```bash
     # Start MySQL database container
     docker-compose up -d db
     
     # Wait ~10-15 seconds for MySQL to initialize, then run migrations
     npm run migration:run
     ```
   - **Option 2: Using Local MySQL**
     - Install and start MySQL locally
     - Create a database: `CREATE DATABASE dota_bootcamper;`
     - Update the `.env` file with your database credentials
     - Run migrations:
       ```bash
       npm run migration:run
       ```
   
   **Note:** Make sure your `.env` file exists with the correct database credentials. If it doesn't exist, create it based on the `.env.example` file.

4. **Start the development server**:
   ```bash
   npm run start:dev
   ```

5. **Start the frontend (in a separate terminal)**:
   ```bash
   npm run client:dev
   ```

---

## Project Structure

```
dota-bootcamper/
├── src/                    # NestJS source code
│   ├── auth/              # Authentication module
│   ├── player/            # Player information module
│   ├── match/             # Match-related modules
│   ├── hero/              # Heroes module
│   ├── leaderboard/       # Leaderboard module
│   ├── live/              # Live games module
│   ├── steam/             # Steam integration module
│   ├── pro-players/       # Pro players module
│   ├── library/           # Library/Favorites module
│   ├── analytics/         # Analytics and comparisons module
│   ├── alerts/            # Alerts and notifications module
│   ├── services/          # Shared services (OpenDota API)
│   ├── models/            # Database models
│   ├── migrations/        # Database migrations
│   ├── database/          # Database configuration
│   ├── utils/             # Utility functions
│   ├── app.module.ts      # Root application module
│   └── main.ts            # Application entry point
├── client/                # React frontend
├── public/                # Static files
└── config/                # Legacy configuration (for reference)
```

---

## Migration from Express

This project has been migrated from Express.js to NestJS. The old Express code is preserved in the root directory for reference, but the application now runs on NestJS. All API endpoints remain the same, ensuring compatibility with the existing React frontend.

---

## Player Data Caching

The application implements a smart caching system for player data to reduce API calls and improve performance:

- **Cache Duration**: Player data is cached for 24 hours
- **Automatic Updates**: If cached data is older than 24 hours, it's automatically refreshed from the OpenDota API
- **Comprehensive Storage**: The cache stores player profiles, statistics (totals, counts), heroes, peers, ratings, and win/loss data
- **Database Storage**: All cached data is stored in the `player_cache` table

### How It Works

1. When a player info request is made, the system first checks the database cache
2. If valid cached data exists (< 24 hours old), it's returned immediately
3. If cache is expired or doesn't exist, fresh data is fetched from OpenDota API
4. The cache is automatically updated with the new data
5. Additional player statistics are fetched and cached for comprehensive data storage

## Database Migrations

The application uses database migrations to manage schema changes:

### Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Rollback the last migration
npm run migration:rollback
```

### Migration Files

- `src/migrations/001-create-player-cache.ts`: Creates the `player_cache` table for storing cached player data
- `src/migrations/002-create-library-tables.ts`: Creates tables for Library, Player Comparisons, Alerts, and Performance Trends

### Migration Structure

Migrations are located in `src/migrations/` and follow the naming convention: `{number}-{description}.ts`

## New Features Overview

### 📚 Library System
The Library feature allows users to bookmark and organize their favorite content:
- **Players**: Save favorite players for quick access
- **Heroes**: Bookmark heroes you want to track or learn
- **Matches**: Save interesting matches for later review
- **Personal Notes**: Add custom notes to any bookmarked item
- **Quick Access**: Filter library by type (player/hero/match)

### ⚔️ Player Comparison
Compare up to 5 players side-by-side with comprehensive statistics:
- **Win Rates**: Compare overall performance
- **KDA Ratios**: Analyze combat effectiveness
- **Rank Comparison**: See MMR and rank differences
- **Hero Preferences**: Compare most played heroes
- **Save Comparisons**: Store comparisons for future reference

### 🎯 Hero Recommendations
Get personalized hero suggestions based on:
- Your play history and performance
- Heroes you haven't played much
- Similar heroes to your best performers
- Current meta trends

### 📊 Performance Trends
Track your improvement over time:
- Historical snapshots of your stats
- Win rate trends
- MMR progression
- KDA improvements
- Visualize your growth

### 🔔 Custom Alerts
Set up notifications for:
- When favorite players start a match
- Rank changes (promotions/demotions)
- Match events
- Custom conditions

### 📈 Meta Analysis
Stay updated with the current meta:
- Most picked heroes
- Highest win rate heroes
- Most banned heroes
- Pro scene trends

## Notes

- The application uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header as `Bearer <token>` for protected routes.
- All API endpoints maintain the same structure as before, so the React frontend should work without modifications.
- The backend is fully typed with TypeScript for better code quality and developer experience.
- Player data caching reduces API calls and improves response times significantly.
- All services include comprehensive logging for debugging and monitoring.
