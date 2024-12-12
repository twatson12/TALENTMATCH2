import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import './ModeratorDashboard.css';

const ModeratorDashboard = () => {
    const [moderatorRequests, setModeratorRequests] = useState([]);
    const [allContent, setAllContent] = useState([]);
    const [flaggedContent, setFlaggedContent] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsSnapshot, contentSnapshot, flaggedSnapshot, usersSnapshot] = await Promise.all([
                    getDocs(collection(db, 'ModeratorRequests')),
                    getDocs(collection(db, 'Opportunities')),
                    getDocs(collection(db, 'FlaggedContent')),
                    getDocs(collection(db, 'User')),
                ]);

                setModeratorRequests(
                    requestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );

                setAllContent(
                    contentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );

                setFlaggedContent(
                    flaggedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );

                setUsers(
                    usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRemoveUser = async (userId) => {
        const confirmRemove = window.confirm(
            'Are you sure you want to remove this user? This action cannot be undone.'
        );
        if (!confirmRemove) return;

        try {
            await deleteDoc(doc(db, 'User', userId));
            setUsers(users.filter((user) => user.id !== userId));
            alert('User removed successfully.');
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Failed to remove user.');
        }
    };

    const handleUnbanUser = async (userId) => {
        const confirmUnban = window.confirm(
            'Are you sure you want to unban this user?'
        );
        if (!confirmUnban) return;

        try {
            await updateDoc(doc(db, 'User', userId), { Status: 'Active' });
            setUsers(users.map((user) => (user.id === userId ? { ...user, Status: 'Active' } : user)));
            alert('User has been unbanned successfully.');
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('Failed to unban user. Please try again.');
        }
    };

    const handleBanUser = async (userId) => {
        const confirmBan = window.confirm(
            'Are you sure you want to ban this user? This action cannot be undone.'
        );
        if (!confirmBan) return;

        try {
            await updateDoc(doc(db, 'User', userId), { Status: 'Banned' });
            setUsers(users.map((user) => (user.id === userId ? { ...user, Status: 'Banned' } : user)));
            alert('User banned successfully.');
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Failed to ban user. Please try again.');
        }
    };

    const handleFlagContent = async (contentId) => {
        const reason = prompt('Enter the reason for flagging this content:');
        if (!reason) return;

        try {
            await addDoc(collection(db, 'FlaggedContent'), {
                ContentId: contentId,
                Reason: reason,
                Status: 'Pending',
                Timestamp: new Date(),
            });
            alert('Content flagged successfully.');
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

            {/* Navigation to Monitored Content */}
            <div className="dashboard-section">
                <button
                    className="monitored-content-button"
                    onClick={() => navigate('/monitored-content')}
                >
                    View Monitored Content
                </button>
            </div>

            {/* All Content Section */}
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
                                        className="flag-button"
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
                    <p>No content available to manage.</p>
                )}
            </div>

            {/* Flagged Content Section */}
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


            {/* User Management Section */}
            <div className="dashboard-section">
                <h2>Manage Users</h2>
                {users.length > 0 ? (
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.Email || 'No email provided'}</td>
                                <td>{user.Status || 'Active'}</td>
                                <td>
                                    {user.Status === 'Banned' ? (
                                        <button
                                            className="unban-button"
                                            onClick={() => handleUnbanUser(user.id)}
                                        >
                                            Unban
                                        </button>
                                    ) : (
                                        <button
                                            className="ban-button"
                                            onClick={() => handleBanUser(user.id)}
                                        >
                                            Ban
                                        </button>
                                    )}
                                    <button
                                        className="remove-button"
                                        onClick={() => handleRemoveUser(user.id)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default ModeratorDashboard;
