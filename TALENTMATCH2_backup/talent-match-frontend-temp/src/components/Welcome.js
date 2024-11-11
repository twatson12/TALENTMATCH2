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

            {/* Testimonials Section */}
            <div className="testimonials">
                <h2 className="testimonials-title">What Our Users Say</h2>
                <div className="review-card">
                    <p>"Talent Match helped me find the perfect cast for my project in no time!"</p>
                    <p className="review-author">- Alex Johnson, Entertainer</p>
                </div>
                <div className="review-card">
                    <p>"I landed my dream role thanks to the opportunities posted here."</p>
                    <p className="review-author">- Jamie Lee, Talent</p>
                </div>
                <div className="review-card">
                    <p>"Moderating on Talent Match has been such a fulfilling experience."</p>
                    <p className="review-author">- Taylor Smith, Moderator</p>
                </div>
            </div>

            {/* Features Section */}
            <div className="features">
                <h2 className="features-title">Why Choose Talent Match?</h2>
                <ul className="features-list">
                    <li>Discover exciting opportunities in the entertainment industry.</li>
                    <li>Connect with skilled professionals and talents worldwide.</li>
                    <li>Seamless application and hiring process.</li>
                    <li>Empower your projects with top-notch talent.</li>
                </ul>
            </div>
        </div>
    );
};

export default Welcome;
