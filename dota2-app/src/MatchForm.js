import React, { useState } from 'react';
import axios from 'axios';

const MatchForm = () => {
    const [matchId, setMatchId] = useState('');
    const [matchData, setMatchData] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMatchData(null);

        try {
            // Замените на правильный путь к вашему серверу
            const response = await axios.get(`http://localhost:3080/api/match/${matchId}`);
            setMatchData(response.data);
        } catch (err) {
            // Вывод ошибки при неудачном запросе
            setError('Ошибка при получении данных о матче. Попробуйте снова.');
            console.error('Error fetching match data:', err);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Dota 2 Match Data</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label htmlFor="match_id" style={styles.label}>Введите ID матча:</label>
                <input
                    type="text"
                    id="match_id"
                    name="match_id"
                    value={matchId}
                    onChange={(e) => setMatchId(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Получить данные</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
            {matchData && (
                <div style={styles.results}>
                    <h2>Детали матча</h2>
                    <p><strong>ID матча:</strong> {matchData.match_id}</p>
                    <p><strong>Длительность:</strong> {matchData.duration} секунд</p>
                    <p><strong>Команда Radiant:</strong> {matchData.radiant_name || 'Неизвестно'}</p>
                    <p><strong>Команда Dire:</strong> {matchData.dire_name || 'Неизвестно'}</p>
                    <p><strong>Победитель:</strong> {matchData.radiant_win ? 'Radiant' : 'Dire'}</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        margin: '20px',
        padding: '20px',
        maxWidth: '600px',
    },
    heading: {
        marginBottom: '20px',
    },
    form: {
        marginBottom: '20px',
    },
    label: {
        marginRight: '10px',
    },
    input: {
        padding: '8px',
        marginRight: '10px',
        width: '200px',
    },
    button: {
        padding: '8px 16px',
        cursor: 'pointer',
    },
    results: {
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
    },
    error: {
        color: 'red',
    },
};

export default MatchForm;
