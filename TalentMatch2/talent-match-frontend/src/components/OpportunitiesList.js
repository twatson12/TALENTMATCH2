// src/components/OpportunitiesList.js
import React, { useEffect, useState } from 'react';
import OpportunityService from '../services/OpportunityServices';
import '../styles/Dashboard.css';

const OpportunitiesList = () => {
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        // Fetch opportunities from the service
        const fetchOpportunities = async () => {
            try {
                const data = await OpportunityService.getAllOpportunities();
                setOpportunities(data);
            } catch (error) {
                console.error("Error fetching opportunities:", error);
            }
        };

        fetchOpportunities();
    }, []);

    return (
        <div className="opportunities-list">
            <h3>Available Opportunities</h3>
            {opportunities.length > 0 ? (
                <ul>
                    {opportunities.map(opportunity => (
                        <li key={opportunity.id} className="opportunity-item">
                            <h4>{opportunity.title}</h4>
                            <p>{opportunity.description}</p>
                            <p><strong>Deadline:</strong> {opportunity.deadline}</p>
                            <p><strong>Location:</strong> {opportunity.location}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No opportunities available at the moment.</p>
            )}
        </div>
    );
};

export default OpportunitiesList;
