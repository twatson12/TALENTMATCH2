import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './TalentDashboard.css';

const TalentDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [applications, setApplications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [auditions, setAuditions] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingAuditions, setLoadingAuditions] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all data
        const fetchOpportunities = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Opportunities'));
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setOpportunities(data);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
            } finally {
                setLoadingOpportunities(false);
            }
        };

        const fetchApplications = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'Applications'));
                const applicationsData = [];

                for (const docSnap of snapshot.docs) {
                    const application = { id: docSnap.id, ...docSnap.data() };

                    const opportunityRef = application.OpportunityID.replace('/Opportunity/', '');
                    const opportunityDoc = await getDoc(doc(db, 'Opportunities', opportunityRef));

                    application.OpportunityTitle = opportunityDoc.exists()
                        ? opportunityDoc.data().Title
                        : 'Unknown Opportunity';

                    applicationsData.push(application);
                }

                setApplications(applicationsData);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoadingApplications(false);
            }
        };

        const fetchMessages = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    alert('You must be logged in.');
                    navigate('/login');
                    return;
                }

                // Fetch messages where the current user is the receiver
                const messagesRef = collection(db, 'Messages');
                const snapshot = await getDocs(messagesRef);

                const userMessages = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((msg) => msg.ReceiverID === `/User/${user.uid}`);

                setMessages(userMessages);

                // Debugging log: Check if messages are fetched
                if (userMessages.length === 0) {
                    console.warn('No messages found for the current user.');
                } else {
                    console.log('Fetched messages:', userMessages);
                }

                // Fetch names for all unique senders
                const senderIds = [...new Set(userMessages.map((msg) => msg.SenderID))];
                const userMapTemp = {};
                for (const senderId of senderIds) {
                    const senderDocId = senderId.replace('/User/', ''); // Adjust the path to match Firestore structure
                    const senderDoc = await getDoc(doc(db, 'User', senderDocId));
                    userMapTemp[senderId] = senderDoc.exists()
                        ? `${senderDoc.data().Fname} ${senderDoc.data().Lname}`
                        : 'Unknown Sender';
                }

                setUserMap(userMapTemp);

                // Debugging log: Verify userMap
                console.log('User Map:', userMapTemp);
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
                    alert('You must be logged in.');
                    navigate('/login');
                    return;
                }

                const auditionsRef = collection(db, 'Auditions');
                const snapshot = await getDocs(auditionsRef);

                const userAuditions = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((audition) => audition.TalentID === `/Users/${user.uid}`);

                setAuditions(userAuditions);
            } catch (error) {
                console.error('Error fetching auditions:', error);
            } finally {
                setLoadingAuditions(false);
            }
        };

        fetchOpportunities();
        fetchApplications();
        fetchMessages();
        fetchAuditions();
    }, [navigate]);

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
                    <button className="settings-button" onClick={() => navigate('/Profile')}>
                        Profile
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No opportunities available at the moment.</p>
                    )}
                </div>

                {/* Applications Section */}
                <div className="dashboard-section">
                    <h2>Your Applications</h2>
                    {loadingApplications ? (
                        <p>Loading your applications...</p>
                    ) : applications.length > 0 ? (
                        <ul className="applications-list">
                            {applications.map((application) => (
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

                {/* Messages Section */}
                <div className="dashboard-section">
                    <h2>Your Messages</h2>
                    {loadingMessages ? (
                        <p>Loading messages...</p>
                    ) : messages.length > 0 ? (
                        messages.map((msg) => (
                            <div key={msg.id} className="message-card">
                                <p>
                                    <strong>From:</strong> {userMap[msg.SenderID] || 'Unknown'}
                                </p>
                                <p>{msg.Message}</p>
                                <p>
                                    <strong>Sent:</strong>{' '}
                                    {new Date(msg.Timestamp.seconds * 1000).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>You have no messages.</p>
                    )}
                </div>

                {/* Auditions Section */}
                <div className="dashboard-section">
                    <h2>Your Auditions</h2>
                    {loadingAuditions ? (
                        <p>Loading auditions...</p>
                    ) : auditions.length > 0 ? (
                        <table className="auditions-table">
                            <thead>
                            <tr>
                                <th>Entertainer</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {auditions.map((audition) => (
                                <tr key={audition.id}>
                                    <td>{userMap[audition.OrganizerID] || 'Unknown Entertainer'}</td>
                                    <td>{new Date(audition.DateTime.seconds * 1000).toLocaleString()}</td>
                                    <td>{audition.Status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>You have no auditions scheduled.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalentDashboard;
