import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
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
    const [applications, setApplications] = useState([]); // New state for applications
    const [loadingApplications, setLoadingApplications] = useState(true);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);





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


        const fetchApplications = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    alert('You must be logged in.');
                    navigate('/login');
                    return;
                }

                // Get Entertainer ID
                const entertainerId = `/User/${user.uid}`; // Assuming you have the ID

                // Fetch Opportunities created by the entertainer
                const opportunitiesRef = collection(db, 'Opportunities');
                const q = query(opportunitiesRef, where('EntertainerID', '==', entertainerId));
                const opportunitySnapshot = await getDocs(q);
                const opportunityDocs = opportunitySnapshot.docs.map((doc) => doc.id); // Get opportunity IDs

                // If no opportunities found, set applications to empty array
                if (opportunityDocs.length === 0) {
                    setApplications([]);
                    setLoadingApplications(false);
                    return;
                }

                // Fetch applications for the retrieved opportunity IDs
                const applicationsRef = collection(db, 'Applications');
                const applicationQuery = query(
                    applicationsRef,
                    where('OpportunityID', 'in', opportunityDocs)
                );
                const applicationSnapshot = await getDocs(applicationQuery);
                const data = applicationSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setApplications(data);
                setLoadingApplications(false);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setLoadingApplications(false);
            }
        };

        fetchOpportunities();
        fetchTalents();
        fetchApplications();
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

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Logout failed.');
        }
    };
// Define fetchMessagesForSelectedTalent at the top
    const fetchMessagesForSelectedTalent = async () => {
        if (!selectedTalent) return;

        setLoadingMessages(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in.');
                navigate('/login');
                return;
            }

            const snapshot = await getDocs(collection(db, 'Messages'));
            const talentMessages = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter(
                    (msg) =>
                        (msg.SenderID === `/User/${user.uid}` && msg.ReceiverID === `/User/${selectedTalent.id}`) ||
                        (msg.ReceiverID === `/User/${user.uid}` && msg.SenderID === `/User/${selectedTalent.id}`)
                );

            // Sort messages by timestamp
            const sortedMessages = talentMessages.sort((a, b) => {
                const timeA = a.Timestamp?.seconds || 0; // Use 0 as fallback if Timestamp is missing
                const timeB = b.Timestamp?.seconds || 0;
                return timeA - timeB;
            });

            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

// Then include this in useEffect
    useEffect(() => {
        fetchMessagesForSelectedTalent(); // Fetch messages when selectedTalent changes
    }, [selectedTalent]);

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

            if (!selectedTalent) {
                alert('Please select a talent to send a message.');
                return;
            }

            await addDoc(collection(db, 'Messages'), {
                SenderID: `/User/${user.uid}`,
                ReceiverID: `/User/${selectedTalent.id}`,
                MessageText: message.trim(),
                Timestamp: serverTimestamp(),
            });

            alert('Message sent successfully!');
            setMessage(''); // Clear the message input field

            // Refresh messages
            fetchMessagesForSelectedTalent();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send the message.');
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

    const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
        try {
            const applicationRef = doc(db, 'Applications', applicationId);
            await updateDoc(applicationRef, {
                Status: newStatus,
            });

            // Update the local state to reflect the change
            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application.id === applicationId
                        ? { ...application, Status: newStatus }
                        : application
                )
            );

            alert(`Application status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating application status:', error);
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

                {/* New Section: Manage Applications */}
                <h2>Review Applications</h2>
                {loadingApplications ? (
                    <p>Loading applications...</p>
                ) : applications.length > 0 ? (
                    <table className="applications-table">
                        <thead>
                        <tr>
                            <th>Opportunity Title</th>
                            <th>Talent Name</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications.map((application) => (
                            <tr key={application.id}>
                                <td>{application.OpportunityTitle}</td>
                                <td>{application.Name}</td>
                                <td>{application.Message}</td>
                                <td>{application.Status}</td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateApplicationStatus(application.id, 'Accepted')}
                                        className="update-status-button"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleUpdateApplicationStatus(application.id, 'Rejected')}
                                        className="update-status-button"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No applications yet.</p>
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
                {/* Section to View Messages */}
                <div className="dashboard-section">
                    <h2>Messages</h2>
                    {selectedTalent ? (
                        <div>
                            <h3>Conversation with {selectedTalent.Fname} {selectedTalent.Lname}</h3>
                            <div className="message-list">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`chat-message ${
                                                msg.SenderID === `/User/${auth.currentUser.uid}`
                                                    ? 'sent-message'
                                                    : 'received-message'
                                            }`}
                                        >
                                            <p>{msg.MessageText}</p>
                                            <span>
                                {msg.Timestamp
                                    ? new Date(msg.Timestamp.seconds * 1000).toLocaleString()
                                    : 'No timestamp'}
                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages to display.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Select a talent to view messages.</p>
                    )}
                </div>
                

                {/* Section for Messages and Sending */}
                <div className="dashboard-section">
                    <h2>{selectedTalent ? `Conversation with ${selectedTalent.Fname}` : 'Messages'}</h2>
                    {selectedTalent ? (
                        <div>
                            {/* Message Thread */}
                            <div className="message-list">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`chat-message ${
                                                msg.SenderID === `/User/${auth.currentUser.uid}`
                                                    ? 'sent-message'
                                                    : 'received-message'
                                            }`}
                                        >
                                            <p>{msg.MessageText}</p>
                                            <span>
                                {msg.Timestamp
                                    ? new Date(msg.Timestamp.seconds * 1000).toLocaleString()
                                    : 'No timestamp'}
                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages to display.</p>
                                )}
                            </div>

                            {/* Send Message */}
                            <div className="send-message-section">
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
                        </div>
                    ) : (
                        <p>Select a talent to view messages and send a message.</p>
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
