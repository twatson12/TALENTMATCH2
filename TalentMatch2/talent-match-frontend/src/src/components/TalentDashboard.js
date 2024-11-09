// src/components/TalentDashboard.js
import React from 'react';
import OpportunitiesList from './OpportunitiesList';

const TalentDashboard = () => {
    return (
        <div>
            <h2>Talent Dashboard</h2>
            <div className="section">
                <OpportunitiesList />
            </div>
        </div>
    );
};

export default TalentDashboard;
