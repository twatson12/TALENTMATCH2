// src/components/EntertainerDashboard.js
import React from 'react';
import OpportunitiesList from './OpportunitiesList';

const EntertainerDashboard = () => {
    return (
        <div>
            <h2>Entertainer Dashboard</h2>
            <div className="section">
                <OpportunitiesList />
            </div>
        </div>
    );
};

export default EntertainerDashboard;
