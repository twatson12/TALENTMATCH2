import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './EntertainerDashboard.css';

const EntertainerDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [talents, setTalents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTalents, setFilteredTalents] = useState([]);
    const [selectedTalent, setSelectedTalent] = useState(null); // For selected talent
    const [message, setMessage] = useState(''); // Message text
    const [auditionDate, setAuditionDate] = useState(''); // Audition date
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);
    const [loadingTalents, setLoadingTalents] = useState(true);
    const navigate = useNavigate();

    // Fetch opportunities and talents
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
                const q = query(talentsRef, where('RoleName', '==', 'Talent'));
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
            setFilteredTalents(talents);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            alert('Message cannot be empty.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in.');
                return;
            }

            await addDoc(collection(db, 'Messages'), {
                SenderID: `/User/${user.uid}`,
                ReceiverID: `/User/${selectedTalent.id}`,
                Message: message,
                Timestamp: serverTimestamp(),
            });

            alert('Message sent successfully!');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleScheduleAudition = async () => {
        if (!auditionDate.trim()) {
            alert('Please select a date and time for the audition.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in.');
                return;
            }

            await addDoc(collection(db, 'Auditions'), {
                OrganizerID: `/User/${user.uid}`,
                TalentID: `/User/${selectedTalent.id}`,
                DateTime: new Date(auditionDate),
                Status: 'Pending Confirmation',
            });

            alert('Audition scheduled successfully!');
            setAuditionDate('');
        } catch (error) {
            console.error('Error scheduling audition:', error);
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
                    <button onClick={() => auth.signOut()} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <button onClick={() => navigate('/post-opportunity')} className="post-opportunity-button">
                    Post New Opportunity
                </button>

                <button onClick={() => navigate('/DisplayRating')} className="post-opportunity-button">
                    Talent Reviews
                </button>

                {/* Section for Posted Opportunities */}
                <h2>Your Posted Opportunities</h2>
                {loadingOpportunities ? (
                    <p>Loading opportunities...</p>
                ) : (
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
                                <td>{new Date(opportunity.Deadline.seconds * 1000).toLocaleDateString()}</td>
                                <td>{new Date(opportunity.PostDate.seconds * 1000).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTalents.map((talent) => (
                            <tr key={talent.id}>
                                <td>{`${talent.Fname || ''} ${talent.Lname || ''}`}</td>
                                <td>{talent.Email}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/view-profile/${talent.id}`)}
                                        className="view-profile-button"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => navigate('/RateAndReview')}
                                        className="rate-talent-button"
                                    >
                                        Review Talent
                                    </button>
                                    <button
                                        onClick={() => setSelectedTalent(talent)}
                                        className="schedule-audition-btn"
                                    >
                                        Schedule Audition
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No talents found matching your search.</p>
                )}

                {/* Section for Messaging Talent */}
                <div className="dashboard-section">
                    <h2>Send Message</h2>
                    {selectedTalent ? (
                        <div>
                            <h3>Send a message to {selectedTalent.Fname} {selectedTalent.Lname}</h3>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="message-textarea"
                            ></textarea>
                            <button onClick={handleSendMessage} className="send-message-button">
                                Send Message
                            </button>
                        </div>
                    ) : (
                        <p>Select a talent to send a message.</p>
                    )}
                </div>

                {/* Section for Scheduling Auditions */}
                <div className="dashboard-section">
                    <h2>Schedule Audition</h2>
                    {selectedTalent ? (
                        <div>
                            <h3>Schedule an audition for {selectedTalent.Fname} {selectedTalent.Lname}</h3>
                            <input
                                type="datetime-local"
                                value={auditionDate}
                                onChange={(e) => setAuditionDate(e.target.value)}
                                className="audition-date-input"
                            />
                            <button onClick={handleScheduleAudition} className="schedule-audition-button">
                                Schedule Audition
                            </button>
                        </div>
                    ) : (
                        <p>Select a talent to schedule an audition.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EntertainerDashboard;
