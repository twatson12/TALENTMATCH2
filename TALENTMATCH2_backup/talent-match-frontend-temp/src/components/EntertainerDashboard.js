import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './EntertainerDashboard.css';

const EntertainerDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [talents, setTalents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTalents, setFilteredTalents] = useState([]);
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);
    const [loadingTalents, setLoadingTalents] = useState(true);
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
                setLoadingOpportunities(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoadingOpportunities(false);
            }
        };

        const fetchTalents = async () => {
            try {
                const talentsRef = collection(db, 'User');
                const q = query(talentsRef, where('RoleName', '==', 'Talent')); // Assuming 'Role' field exists in the database
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setTalents(data);
                setFilteredTalents(data);
                setLoadingTalents(false);
            } catch (error) {
                console.error('Error fetching talents:', error);
                setLoadingTalents(false);
            }
        };

        fetchOpportunities();
        fetchTalents();
    }, [navigate]);

    const handleLogout = () => {
        auth.signOut().then(() => {
            localStorage.removeItem('userRole');
            navigate('/login');
        });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query) {
            const filtered = talents.filter(
                (talent) =>
                    talent.Fname?.toLowerCase().includes(query) ||
                    talent.Lname?.toLowerCase().includes(query) ||
                    talent.Email?.toLowerCase().includes(query)
            );
            setFilteredTalents(filtered);
        } else {
            setFilteredTalents(talents); // Reset to all talents if query is empty
        }
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

                <button
                    onClick={() => navigate('/DisplayRating')}
                    className="post-opportunity-button"
                >
                    Talent Reviews
                </button>

                {/* Section for Posted Opportunities */}
                <h2>Your Posted Opportunities</h2>
                {loadingOpportunities ? (
                    <p>Loading opportunities...</p>
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

                {/* Section for Browsing Talents */}
                <h2>Search for Talent</h2>
                <input
                    type="text"
                    placeholder="Search talents by name or email..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-bar"
                />
                {loadingTalents ? (
                    <p>Loading talents...</p>
                ) : filteredTalents.length > 0 ? (
                    <table className="talents-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Specialization</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTalents.map((talent) => (
                            <tr key={talent.id}>
                                <td>{`${talent.Fname || ''} ${talent.Lname || ''}`}</td>
                                <td>{talent.Email}</td>
                                <td>{talent.Specialization || 'Unknown'}</td>
                                <td>
                                    <button
                                        onClick={() => alert(`Profile details for ${talent.Fname}`)}
                                        className="view-profile-button"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/RateAndReview')}
                                        className="Rate-and-Review-Talent"
                                    >
                                        Review A Talent
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No talents found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default EntertainerDashboard;
