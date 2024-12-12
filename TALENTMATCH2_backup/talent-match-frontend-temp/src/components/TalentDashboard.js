import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import {collection, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp, query, where} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './TalentDashboard.css';

const TalentDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [auditions, setAuditions] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState([]);
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingAuditions, setLoadingAuditions] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            await fetchOpportunities();
            await fetchApplications();
            await fetchMessages();
            await fetchAuditions();
            await fetchBookmarkedOpportunities();
        };

        const fetchOpportunities = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Opportunities'));
                setOpportunities(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            } finally {
                setLoadingOpportunities(false);
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

                const applicationsRef = collection(db, 'Applications');
                const q = query(applicationsRef, where('TalentID', '==', `/User/${user.uid}`));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
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
        const fetchMessages = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }
                const snapshot = await getDocs(collection(db, 'Messages'));
                const userMessages = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((msg) => msg.ReceiverID === `/User/${user.uid}`);
                setMessages(userMessages);
                const senderIds = [...new Set(userMessages.map((msg) => msg.SenderID))];
                const userMapTemp = {};
                for (const senderId of senderIds) {
                    const senderDocId = senderId.replace('/User/', '');
                    const senderDoc = await getDoc(doc(db, 'User', senderDocId));
                    userMapTemp[senderId] = senderDoc.exists()
                        ? `${senderDoc.data().Fname} ${senderDoc.data().Lname}`
                        : 'Unknown Sender';
                }
                setUserMap(userMapTemp);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoadingMessages(false);
            }
        };

        const fetchAuditions = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }
                const snapshot = await getDocs(collection(db, 'Auditions'));
                setAuditions(
                    snapshot.docs
                        .map((doc) => ({ id: doc.id, ...doc.data() }))
                        .filter((audition) => audition.TalentID === `/Users/${user.uid}`)
                );
            } catch (error) {
                console.error('Error fetching auditions:', error);
            } finally {
                setLoadingAuditions(false);
            }
        };

        const fetchBookmarkedOpportunities = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const userDoc = await getDoc(doc(db, 'User', user.uid));
            if (userDoc.exists()) {
                setBookmarkedOpportunities(userDoc.data().bookmarkedOpportunities || []);
            }
        };

        fetchData();
    }, [navigate]);

    const handleBookmarkToggle = async (opportunityId) => {
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in.');
            return;
        }

        const updatedBookmarks = bookmarkedOpportunities.includes(opportunityId)
            ? bookmarkedOpportunities.filter((id) => id !== opportunityId)
            : [...bookmarkedOpportunities, opportunityId];

        setBookmarkedOpportunities(updatedBookmarks);

        await updateDoc(doc(db, 'User', user.uid), {
            bookmarkedOpportunities: updatedBookmarks,
        });
    };

    const handleRespondToAudition = async (auditionId, response) => {
        try {
            const auditionRef = doc(db, 'Auditions', auditionId);
            await updateDoc(auditionRef, {
                Status: response,
            });
            alert(`Audition ${response === 'Accepted' ? 'accepted' : 'declined'} successfully!`);
            setAuditions((prevAuditions) =>
                prevAuditions.map((audition) =>
                    audition.id === auditionId ? { ...audition, Status: response } : audition
                )
            );
        } catch (error) {
            console.error('Error responding to audition:', error);
            alert('Failed to respond to the audition. Please try again.');
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
                    {loadingOpportunities ? (
                        <p>Loading opportunities...</p>
                    ) : opportunities.length > 0 ? (
                        <div className="opportunities-scrollable">
                            {opportunities.map((opportunity) => (
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
                                    <button onClick={() => handleBookmarkToggle(opportunity.id)}>
                                        {bookmarkedOpportunities.includes(opportunity.id)
                                            ? 'Unbookmark'
                                            : 'Bookmark'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No opportunities available at the moment.</p>
                    )}
                </div>
                {/* Messages Section */}
                <div className="dashboard-section">
                    <h2>Your Messages</h2>
                    {loadingMessages ? (
                        <p>Loading your messages...</p>
                    ) : messages.length > 0 ? (
                        <ul className="messages-list">
                            {messages.map((message) => (
                                <li key={message.id} className="message-item">
                                    <p>
                                        <strong>From:</strong> {userMap[message.SenderID] || 'Unknown Sender'}
                                    </p>
                                    <p>{message.Content}</p>
                                    <p>
                                        <strong>Date:</strong>{' '}
                                        {new Date(message.Timestamp.seconds * 1000).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You have no new messages.</p>
                    )}
                </div>
                {/* Bookmarked Opportunities Section */}
                <div className="dashboard-section">
                    <h2>Bookmarked Opportunities</h2>
                    {bookmarkedOpportunities.length === 0 ? (
                        <p>You have not bookmarked any opportunities.</p>
                    ) : (
                        <div className="opportunities-scrollable">
                            {opportunities
                                .filter((opportunity) => bookmarkedOpportunities.includes(opportunity.id))
                                .map((opportunity) => (
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
                                        <button onClick={() => handleBookmarkToggle(opportunity.id)}>
                                            {bookmarkedOpportunities.includes(opportunity.id)
                                                ? 'Unbookmark'
                                                : 'Bookmark'}
                                        </button>
                                    </div>
                                ))}
                        </div>
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
                {/* Your Auditions Section */}
                <div className="dashboard-section">
                    <h2>Your Auditions</h2>
                    {loadingAuditions ? (
                        <p>Loading your auditions...</p>
                    ) : auditions.length > 0 ? (
                        <ul>
                            {auditions.map((audition) => (
                                <li key={audition.id}>
                                    <p>
                                        <strong>Date & Time:</strong>{' '}
                                        {new Date(audition.DateTime).toLocaleString()}
                                    </p>
                                    <p><strong>Location:</strong> {audition.Location}</p>
                                    <p><strong>Status:</strong> {audition.Status}</p>
                                    {audition.Status === 'Pending Confirmation' && (
                                        <div>
                                            <button
                                                onClick={() =>
                                                    handleRespondToAudition(audition.id, 'Accepted')
                                                }
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRespondToAudition(audition.id, 'Declined')
                                                }
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No auditions scheduled for you yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalentDashboard;
