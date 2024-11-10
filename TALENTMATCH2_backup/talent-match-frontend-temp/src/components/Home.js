import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Home.css';

const Home = () => {
    const [applications, setApplications] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user-specific data (applications and opportunities)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Applications for Talent
                const applicationsRef = collection(db, 'Application');
                const applicationsQuery = query(applicationsRef, where('TalentID', '==', 'YOUR_TALENT_ID')); // Replace with the current user's ID
                const applicationsSnapshot = await getDocs(applicationsQuery);
                const applicationsData = applicationsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setApplications(applicationsData);

                // Fetch Future Opportunities
                const opportunitiesRef = collection(db, 'Opportunity');
                const opportunitiesSnapshot = await getDocs(opportunitiesRef);
                const opportunitiesData = opportunitiesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOpportunities(opportunitiesData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="home-container">
            <h1>Welcome to Your Dashboard</h1>

            <div className="section">
                <h2>Your Applications</h2>
                {applications.length > 0 ? (
                    applications.map((application) => (
                        <div key={application.id} className="application-card">
                            <p><strong>Opportunity:</strong> {application.OpportunityID}</p>
                            <p><strong>Status:</strong> {application.Status}</p>
                            <p><strong>Submission Date:</strong> {new Date(application.SubmissionDate.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No applications found.</p>
                )}
            </div>

            <div className="section">
                <h2>Future Opportunities</h2>
                {opportunities.length > 0 ? (
                    opportunities.map((opportunity) => (
                        <div key={opportunity.id} className="opportunity-card">
                            <h3>{opportunity.Title}</h3>
                            <p><strong>Description:</strong> {opportunity.Description}</p>
                            <p><strong>Deadline:</strong> {new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No future opportunities available.</p>
                )}
            </div>

            <div className="section">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/profile">View/Edit Profile</a></li>
                    <li><a href="/applications">Manage Applications</a></li>
                    <li><a href="/opportunities">Browse Opportunities</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Home;
