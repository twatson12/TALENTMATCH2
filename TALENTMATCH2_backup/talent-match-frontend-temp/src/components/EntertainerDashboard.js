import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ScheduleAudition from './ScheduleAudition';
import './EntertainerDashboard.css';
import MessageTalent from "./MessageTalent";
import ViewTalentProfile from "./ViewTalentProfile";

const EntertainerDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [talents, setTalents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTalents, setFilteredTalents] = useState([]);
    const [messages, setMessages] = useState([]);
    const [auditions, setAuditions] = useState([]); // New state for auditions
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);
    const [loadingTalents, setLoadingTalents] = useState(true);
    const [selectedTalent, setSelectedTalent] = useState(null); // Talent selected for messaging or auditions
    const [isScheduling, setIsScheduling] = useState(false); // Show schedule audition form
    const navigate = useNavigate();

    // Fetch data for opportunities, talents, messages, and auditions
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
                const q = query(talentsRef, where('RoleName', '==', 'Talent')); // Assuming 'RoleName' identifies talents
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

        const fetchMessages = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    alert('You must be logged in.');
                    return;
                }

                const messagesRef = collection(db, 'Messages');
                const q = query(messagesRef, where('SenderID', '==', `/User/${user.uid}`));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchAuditions = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    alert('You must be logged in.');
                    return;
                }

                const auditionsRef = collection(db, 'Auditions');
                const q = query(auditionsRef, where('OrganizerID', '==', `/User/${user.uid}`));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setAuditions(data);
            } catch (error) {
                console.error('Error fetching auditions:', error);
            }
        };

        fetchOpportunities();
        fetchTalents();
        fetchMessages();
        fetchAuditions(); // Fetch auditions data
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
            setFilteredTalents(talents); // Reset to all talents if query is empty
        }
    };

    const handleScheduleAudition = (talent) => {
        setSelectedTalent(talent);
        setIsScheduling(true);
    };

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
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTalents.map((talent) => (
                            <tr key={talent.id}>
                                <td>{`${talent.Fname || ''} ${talent.Lname || ''}`}</td>
                                <td>{talent.Email}</td>
                                <td>
                                    {/* View Profile Button */}
                                    <button
                                        onClick={() => navigate(`/view-talent-profile/${talent.id}`)}
                                        className="view-profile-button"
                                    >
                                        View Profile
                                    </button>

                                    {/* Schedule Audition Button */}
                                    <button
                                        onClick={() => handleScheduleAudition(talent)}
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
                <h2>Message Talent</h2>
                {selectedTalent ? (
                    <div className="message-talent-section">
                        <h3>Send a Message to {`${selectedTalent.Fname || ''} ${selectedTalent.Lname || ''}`}</h3>
                        <MessageTalent talentID={selectedTalent.id}/>
                        <button
                            onClick={() => setSelectedTalent(null)}
                            className="close-messaging-btn"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <p>Select a talent to message them.</p>
                )}


                {/* Section for Scheduling Auditions */}
                <h2>Upcoming Auditions</h2>
                {auditions.length > 0 ? (
                    <table className="auditions-table">
                        <thead>
                        <tr>
                            <th>Talent ID</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {auditions.map((audition) => (
                            <tr key={audition.id}>
                                <td>{audition.TalentID}</td>
                                <td>{new Date(audition.DateTime).toLocaleString()}</td>
                                <td>{audition.Location}</td>
                                <td>{audition.Status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming auditions scheduled.</p>
                )}

                {/* Schedule Audition Section */}
                {isScheduling && selectedTalent && (
                    <div className="scheduling-section">
                        <ScheduleAudition talentID={selectedTalent.id} />
                        <button onClick={() => setIsScheduling(false)} className="close-scheduling-btn">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntertainerDashboard;
