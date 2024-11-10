import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import './OpportunityDetails.css';

const OpportunityDetails = () => {
    const { id } = useParams(); // Get opportunity ID from URL
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const opportunityRef = doc(db, 'Opportunity', id);
                const opportunityDoc = await getDoc(opportunityRef);

                if (opportunityDoc.exists()) {
                    setOpportunity(opportunityDoc.data());
                } else {
                    console.error('No such opportunity!');
                }
            } catch (error) {
                console.error('Error fetching opportunity details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!opportunity) {
        return <p>Opportunity not found.</p>;
    }

    return (
        <div className="opportunity-details-container">
            <h1>{opportunity.Title || 'Untitled Opportunity'}</h1>
            <p><strong>Description:</strong> {opportunity.Description || 'No description available.'}</p>
            <p><strong>Deadline:</strong> {opportunity.Deadline ? new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString() : 'No deadline set.'}</p>
            <p><strong>Additional Details:</strong> {opportunity.AdditionalDetails || 'No additional details available.'}</p>
        </div>
    );
};

export default OpportunityDetails;
