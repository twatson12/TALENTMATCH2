// src/components/EntertainerDashboard.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './EntertainerDashboard.css';

const EntertainerDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch opportunities created by the logged-in entertainer
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    alert('You must be logged in.');
                    navigate('/login');
                    return;
                }

                const opportunitiesRef = collection(db, 'Opportunities');
                const q = query(opportunitiesRef, where('EntertainerID', '==', `/User/${user.uid}`));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setOpportunities(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [navigate]);

    const handleLogout = () => {
        auth.signOut().then(() => {
            localStorage.removeItem('userRole');
            navigate('/login');
        });
    };

    return (
        <div className="entertainer-dashboard">
            <header className="dashboard-header">
                <h1>Entertainer Dashboard</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/settings')} className="settings-button">
                        Settings
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>
            <div className="dashboard-content">
                <button
                    onClick={() => navigate('/post-opportunity')}
                    className="post-opportunity-button"
                >
                    Post New Opportunity
                </button>
                <h2>Your Posted Opportunities</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : opportunities.length > 0 ? (
                    <table className="opportunities-table">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Deadline</th>
                            <th>Post Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {opportunities.map((opportunity) => (
                            <tr key={opportunity.id}>
                                <td>{opportunity.Title}</td>
                                <td>{opportunity.Description}</td>
                                <td>
                                    {new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString()}
                                </td>
                                <td>
                                    {new Date(opportunity.PostDate.seconds * 1000).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You have not posted any opportunities yet.</p>
                )}
            </div>
        </div>
    );
};

export default EntertainerDashboard;
