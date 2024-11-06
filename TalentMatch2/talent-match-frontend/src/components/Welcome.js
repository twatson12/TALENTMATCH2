// src/components/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();

    const handleBeginClick = () => {
        navigate('/login'); // Redirects to the login page
    };

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">Welcome to Talent Match</h1>
                <p className="welcome-message">
                    Talent Match is your one-stop platform for connecting with talented professionals and exciting opportunities in the entertainment industry. Get ready to explore, connect, and grow!
                </p>
                <button className="begin-button" onClick={handleBeginClick}>Begin</button>
            </div>
        </div>
    );
};

export default Welcome;
