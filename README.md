# Dota-bootcamper

Dota-bootcamper is a web application designed to provide detailed statistics and insights for Dota 2 players. Using the OpenDota API, the application fetches and displays data such as player information, match history, live games, leaderboards, and hero stats. The backend is built with **NestJS** (TypeScript), and the frontend is powered by React.

---

## Features

- **User Authentication**: Secure login system with JWT tokens for accessing personalized data.
- **Player Statistics**: View player profiles, match history, and detailed match summaries.
- **Live Matches**: Fetch live games data directly from OpenDota.
- **Leaderboards**: Display rankings of top-performing players.
- **Heroes Statistics**: Explore detailed stats for each Dota 2 hero.
- **Responsive Frontend**: Built with React for a seamless user experience.
- **Static File Serving**: Hosts a public-facing webpage for additional tools or resources.

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
   - Create a MySQL database
   - Update the `.env` file with your database credentials
   - The application will automatically sync models (in development mode)

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
│   ├── services/          # Shared services (OpenDota API)
│   ├── models/            # Database models
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

## Notes

- The application uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header as `Bearer <token>` for protected routes.
- All API endpoints maintain the same structure as before, so the React frontend should work without modifications.
- The backend is fully typed with TypeScript for better code quality and developer experience.
