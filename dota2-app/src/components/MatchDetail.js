import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchDetail = ({ matchId }) => {
    const [matchDetails, setMatchDetails] = useState(null);
    const [recommendations, setRecommendations] = useState(null);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await axios.get(`/api/matchdetails/${matchId}`);
                setMatchDetails(response.data.matchDetails);
                setRecommendations(response.data.recommendations);
            } catch (error) {
                console.error('Error fetching match details:', error);
            }
        };

        fetchMatchDetails();
    }, [matchId]);

    if (!matchDetails) return <div>Loading...</div>;

    return (
        <div>
            <h1>Match Details</h1>
            <p>Hero: {matchDetails.hero_name}</p>
            <p>Duration: {matchDetails.duration} minutes</p>
            {/* Render other match details */}

            <h2>Recommendations</h2>
            <ul>
                {recommendations && recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
    );
};

export default MatchDetail;
