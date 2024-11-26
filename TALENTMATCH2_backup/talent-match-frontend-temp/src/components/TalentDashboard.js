import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './TalentDashboard.css';

const TalentDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Opportunities'));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOpportunities(data);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            } finally {
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
                    const opportunityRef = application.OpportunityID.replace('/Opportunity/', '');
                    const opportunityDoc = await getDoc(doc(db, 'Opportunities', opportunityRef));

                    application.OpportunityTitle = opportunityDoc.exists()
                        ? opportunityDoc.data().Title
                        : 'Unknown Opportunity'; // Fallback if not found

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

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Logout failed.');
        }
    };

    return (
        <div className="talent-dashboard">
            <header className="dashboard-header">
                <h1>Talent Dashboard</h1>
                <div className="header-actions">
                    <button className="settings-button" onClick={() => navigate('/settings')}>
                        Settings
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>

                </div>
            </header>
            <div className="dashboard-content">
                {/* Available Opportunities Section */}
                <div className="dashboard-section">
                    <h2>Available Opportunities</h2>
                    {loading ? (
                        <p>Loading opportunities...</p>
                    ) : opportunities.length > 0 ? (
                        <div className="opportunities-scrollable">
                            {opportunities.map(opportunity => (
                                <div key={opportunity.id} className="opportunity-card">
                                    <h3>{opportunity.Title}</h3>
                                    <p>{opportunity.Description}</p>
                                    <p>
                                        <strong>Deadline:</strong>{' '}
                                        {new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString()}
                                    </p>
                                    <button onClick={() => navigate(`/apply/${opportunity.id}`)}>
                                        Apply
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No opportunities available at the moment.</p>
                    )}
                </div>

                {/* Your Applications Section */}
                <div className="dashboard-section">
                    <h2>Your Applications</h2>
                    {applications.length > 0 ? (
                        <ul className="applications-list">
                            {applications.map(application => (
                                <li key={application.id} className="application-item">
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

                {/* Upcoming Deadlines Section */}
                <div className="dashboard-section">
                    <h2>Upcoming Deadlines</h2>
                    {opportunities
                        .filter(opportunity => {
                            const deadline = new Date(opportunity.Deadline.seconds * 1000);
                            return deadline > new Date() && deadline - new Date() <= 7 * 24 * 60 * 60 * 1000; // 7 days
                        })
                        .map(opportunity => (
                            <div key={opportunity.id} className="opportunity-card">
                                <h3>{opportunity.Title}</h3>
                                <p>
                                    Deadline: {new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default TalentDashboard;
