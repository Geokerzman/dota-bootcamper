// components/PlayerSearch.js
import React, { useState } from 'react';
import axios from 'axios';

const PlayerSearch = () => {
    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/players/search?name=${name}`);
            setPlayers(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching players');
            setPlayers([]);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter player name"
            />
            <button onClick={handleSearch}>Search</button>

            {error && <p>{error}</p>}

            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name} - {player.team_name || 'Unknown Team'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerSearch;
