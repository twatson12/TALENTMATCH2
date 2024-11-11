import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import './TalentDashboard.css';

const TalentDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
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

        const fetchApplications = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Applications'));
                const applicationsData = [];

                for (const docSnap of snapshot.docs) {
                    const application = { id: docSnap.id, ...docSnap.data() };

                    // Fetch opportunity title using OpportunityID reference
                    const opportunityDoc = await getDoc(doc(db, application.OpportunityID));
                    if (opportunityDoc.exists()) {
                        application.OpportunityTitle = opportunityDoc.data().Title;
                    } else {
                        application.OpportunityTitle = 'Unknown Opportunity'; // Fallback
                    }

                    applicationsData.push(application);
                }

                setApplications(applicationsData);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchOpportunities();
        fetchApplications();
    }, []);

    return (
        <div className="talent-dashboard">
            <h1>Talent Dashboard</h1>
            <div className="dashboard-section">
                <h2>Available Opportunities</h2>
                {loading ? (
                    <p>Loading opportunities...</p>
                ) : opportunities.length > 0 ? (
                    <div className="opportunities-grid">
                        {opportunities.map(opportunity => (
                            <div key={opportunity.id} className="opportunity-card">
                                <h3>{opportunity.Title}</h3>
                                <p>{opportunity.Description}</p>
                                <p>
                                    <strong>Deadline:</strong>{' '}
                                    {new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString()}
                                </p>
                                <button onClick={() => alert('Application functionality not implemented yet.')}>
                                    Apply
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No opportunities available at the moment.</p>
                )}
            </div>
            <div className="dashboard-section">
                <h2>Your Applications</h2>
                {applications.length > 0 ? (
                    <ul>
                        {applications.map(application => (
                            <li key={application.id}>
                                <p>
                                    <strong>Opportunity:</strong> {application.OpportunityTitle}
                                </p>
                                <p>
                                    <strong>Status:</strong> {application.Status}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have not applied for any opportunities yet.</p>
                )}
            </div>
        </div>
    );
};

export default TalentDashboard;
