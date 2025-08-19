# Dota-bootcamper

Dota-bootcamper is a web application designed to provide detailed statistics and insights for Dota 2 players. Using the OpenDota API, the application fetches and displays data such as player information, match history, live games, leaderboards, and hero stats. The backend is built with Node.js and Express, and the frontend is powered by React.

---

## Features

- **User Authentication**: Secure login system for accessing personalized data.
- **Player Statistics**: View player profiles, match history, and detailed match summaries.
- **Live Matches**: Fetch live games data directly from OpenDota.
- **Leaderboards**: Display rankings of top-performing players.
- **Heroes Statistics**: Explore detailed stats for each Dota 2 hero.
- **Responsive Frontend**: Built with React for a seamless user experience.
- **Static File Serving**: Hosts a public-facing webpage for additional tools or resources.

---

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Web framework for building RESTful APIs.
- **Sequelize**: ORM for database management.
- **OpenDota API**: Data source for Dota 2 statistics and matches.

### Frontend
- **React**: For creating an interactive and dynamic user interface.

---

## Frontend (React) development

- Install client dependencies: `npm install --prefix client`
- Run client dev server: `npm run client:dev`
- API requests to `/api/*` are proxied to `http://localhost:5000` via Vite config.

## Build and serve

- Build client: `npm run client:build`
- Start backend: `npm start`
- In production (`NODE_ENV=production`), the server serves the React build from `client/dist`.

### Database
- **PostgreSQL/MySQL** (via Sequelize): Database for storing user and match data.

---


## Main API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: User login.

### Player Stats
- **GET** `/api/playerinfo`: Fetch player details.

### Matches
- **GET** `/api/matches`: Retrieve recent matches.
- **GET** `/api/recentpromatches`: Fetch recent professional matches.

### Live Games
- **GET** `/api/live`: Retrieve live games.

### Heroes
- **GET** `/api/heroes`: Fetch statistics for all heroes.

### Leaderboard
- **GET** `/api/leaderboard`: Retrieve leaderboard data.

---

## Setup Instructions

### Set up your environment variables
Create a `.env` file in the root directory and configure the following:

- PORT=5000
- DB_HOST=your_database_host
- DB_USER=your_database_user
- DB_PASSWORD=your_database_password
- DB_NAME=your_database_name
- API_KEY=your_opendota_api_key

---

## Install dependecies and launch backend
- npm install
- npm start
