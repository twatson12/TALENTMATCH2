import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import './ModeratorDashboard.css';

const ModeratorDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                // Fetch all opportunities
                const snapshot = await getDocs(collection(db, 'Opportunities'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOpportunities(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    const handleFlagOpportunity = async (opportunityId, title) => {
        const reason = prompt(`Why are you flagging "${title}" as inappropriate?`);

        if (reason) {
            try {
                const user = auth.currentUser;
                if (!user) {
                    alert('You must be logged in as a moderator to flag content.');
                    return;
                }

                await addDoc(collection(db, 'ModeratorRequests'), {
                    OpportunityID: `/Opportunities/${opportunityId}`,
                    ModeratorID: `/User/${user.uid}`,
                    Reason: reason,
                    Status: 'Pending',
                    Timestamp: new Date(),
                });

                alert('Content flagged successfully. Admin will review it.');
            } catch (error) {
                console.error('Error flagging content:', error);
                alert('Failed to flag content.');
            }
        }
    };

    const handleRemoveOpportunity = async (opportunityId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this opportunity?');
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, 'Opportunities', opportunityId));
                setOpportunities(opportunities.filter(opportunity => opportunity.id !== opportunityId));
                alert('Opportunity removed successfully.');
            } catch (error) {
                console.error('Error removing opportunity:', error);
                alert('Failed to remove opportunity.');
            }
        }
    };

    return (
        <div className="moderator-dashboard">
            <h1>Moderator Dashboard</h1>
            <div className="dashboard-content">
                <h2>Opportunities</h2>
                {loading ? (
                    <p>Loading opportunities...</p>
                ) : opportunities.length > 0 ? (
                    <div className="opportunities-list">
                        {opportunities.map(opportunity => (
                            <div key={opportunity.id} className="opportunity-card">
                                <h3>{opportunity.Title}</h3>
                                <p>{opportunity.Description}</p>
                                <p>
                                    <strong>Deadline:</strong>{' '}
                                    {new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => handleFlagOpportunity(opportunity.id, opportunity.Title)}
                                    className="flag-button"
                                >
                                    Flag as Inappropriate
                                </button>
                                <button
                                    onClick={() => handleRemoveOpportunity(opportunity.id)}
                                    className="delete-button"
                                >
                                    Remove Content
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No opportunities available.</p>
                )}
            </div>
        </div>
    );
};

export default ModeratorDashboard;
