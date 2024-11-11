import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import './ModeratorDashboard.css';

const ModeratorDashboard = () => {
    const [moderatorRequests, setModeratorRequests] = useState([]);
    const [allContent, setAllContent] = useState([]);
    const [flaggedContent, setFlaggedContent] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModeratorRequests = async () => {
            try {
                const requestsRef = collection(db, 'ModeratorRequests');
                const snapshot = await getDocs(requestsRef);
                const requests = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setModeratorRequests(requests);
            } catch (error) {
                console.error('Error fetching moderator requests:', error);
            }
        };

        const fetchAllContent = async () => {
            try {
                const contentRef = collection(db, 'Opportunities'); // Replace with your content collection
                const snapshot = await getDocs(contentRef);
                const contentData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllContent(contentData);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        const fetchFlaggedContent = async () => {
            try {
                const flaggedRef = collection(db, 'FlaggedContent');
                const snapshot = await getDocs(flaggedRef);
                const flaggedData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFlaggedContent(flaggedData);
            } catch (error) {
                console.error('Error fetching flagged content:', error);
            }
        };

        fetchModeratorRequests();
        fetchAllContent();
        fetchFlaggedContent();
        setLoading(false);
    }, []);

    //const handleApproveRequest = async (requestId) => {
        try {
            const requestRef = doc(db, 'ModeratorRequests', requestId);
            await updateDoc(requestRef, { Status: 'Approved' });
            setModeratorRequests(
                moderatorRequests.filter((request) => request.id !== requestId)
            );
            alert('Moderator request approved!');
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request.');
        }
    };

    //const handleRejectRequest = async (requestId) => {
        try {
            const requestRef = doc(db, 'ModeratorRequests', requestId);
            await updateDoc(requestRef, { Status: 'Rejected' });
            setModeratorRequests(
                moderatorRequests.filter((request) => request.id !== requestId)
            );
            alert('Moderator request rejected.');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request.');
        }
    };

    const handleFlagContent = async (contentId) => {
        try {
            const reason = prompt('Enter the reason for flagging this content:');
            if (reason) {
                await addDoc(collection(db, 'FlaggedContent'), {
                    ContentId: contentId,
                    Reason: reason,
                    Status: 'Pending',
                    Timestamp: new Date(),
                });
                alert('Content flagged successfully.');
            }
        } catch (error) {
            console.error('Error flagging content:', error);
            alert('Failed to flag content.');
        }
    };

    const handleResolveFlag = async (contentId) => {
        try {
            const contentRef = doc(db, 'FlaggedContent', contentId);
            await updateDoc(contentRef, { Status: 'Resolved' });
            setFlaggedContent(
                flaggedContent.filter((content) => content.id !== contentId)
            );
            alert('Flag resolved successfully!');
        } catch (error) {
            console.error('Error resolving flag:', error);
            alert('Failed to resolve flagged content.');
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
            alert('Logged out successfully.');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="moderator-dashboard">
            <header className="dashboard-header">
                <h1>Moderator Dashboard</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/settings')} className="settings-button">
                        Settings
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>
            <div className="dashboard-section">
                <h2>All Content</h2>
                {allContent.length > 0 ? (
                    <table className="moderator-table">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allContent.map((content) => (
                            <tr key={content.id}>
                                <td>{content.Title}</td>
                                <td>{content.Description}</td>
                                <td>
                                    <button
                                        className="resolve-button"
                                        onClick={() => handleFlagContent(content.id)}
                                    >
                                        Flag
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No content available at the moment.</p>
                )}
            </div>
            <div className="dashboard-section">
                <h2>Flagged Content</h2>
                {flaggedContent.length > 0 ? (
                    <table className="flagged-table">
                        <thead>
                        <tr>
                            <th>Content ID</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {flaggedContent.map((content) => (
                            <tr key={content.id}>
                                <td>{content.ContentId}</td>
                                <td>{content.Reason || 'No reason provided'}</td>
                                <td>{content.Status || 'Pending'}</td>
                                <td>
                                    <button
                                        className="resolve-button"
                                        onClick={() => handleResolveFlag(content.id)}
                                    >
                                        Resolve
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No flagged content at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default ModeratorDashboard;
