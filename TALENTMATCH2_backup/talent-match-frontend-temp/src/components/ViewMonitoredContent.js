import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CSVLink } from 'react-csv';
import './ViewMonitoredContent.css';

const ViewMonitoredContent = () => {
    const [monitoredContent, setMonitoredContent] = useState([]);
    const [userInteractions, setUserInteractions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const monitoredContentSnapshot = await getDocs(collection(db, 'MonitoredContent'));
                const userInteractionsSnapshot = await getDocs(collection(db, 'UserInteractions'));

                setMonitoredContent(
                    monitoredContentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );

                setUserInteractions(
                    userInteractionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const csvHeaders = [
        { label: 'Interaction ID', key: 'id' },
        { label: 'Action Type', key: 'actionType' },
        { label: 'User 1', key: 'user1' },
        { label: 'User 2', key: 'user2' },
        { label: 'Details', key: 'details' },
        { label: 'Timestamp', key: 'timestamp' },
    ];

    return (
        <div className="monitored-content-page">
            <header className="page-header">
                <h1>View Monitored Content</h1>
            </header>

            {/* Overview Section */}
            <section className="overview-section">
                <div className="overview-item">
                    <h3>Total Content</h3>
                    <p>{monitoredContent.length}</p>
                </div>
                <div className="overview-item">
                    <h3>User Interactions</h3>
                    <p>{userInteractions.length}</p>
                </div>
            </section>

            {/* Monitored Content Section */}
            <section className="content-table-section">
                <h2>Monitored Content</h2>
                {loading ? (
                    <p>Loading monitored content...</p>
                ) : monitoredContent.length > 0 ? (
                    <table className="monitored-content-table">
                        <thead>
                        <tr>
                            <th>Content ID</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Reason</th>
                            <th>Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {monitoredContent.map((content) => (
                            <tr key={content.id}>
                                <td>{content.id}</td>
                                <td>{content.user}</td>
                                <td>{content.type}</td>
                                <td>{content.status}</td>
                                <td>{content.reason}</td>
                                <td>{new Date(content.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No monitored content available.</p>
                )}
            </section>

            {/* User Interactions Section */}
            <section className="user-interactions-section">
                <h2>User Interactions</h2>
                {loading ? (
                    <p>Loading user interactions...</p>
                ) : userInteractions.length > 0 ? (
                    <table className="user-interactions-table">
                        <thead>
                        <tr>
                            <th>Interaction ID</th>
                            <th>Action Type</th>
                            <th>User 1</th>
                            <th>User 2</th>
                            <th>Details</th>
                            <th>Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userInteractions.map((interaction) => (
                            <tr key={interaction.id}>
                                <td>{interaction.id}</td>
                                <td>{interaction.actionType}</td>
                                <td>{interaction.user1}</td>
                                <td>{interaction.user2}</td>
                                <td>{interaction.details}</td>
                                <td>{new Date(interaction.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No user interactions available.</p>
                )}
            </section>

            {/* Download Data Section */}
            <div className="download-section">
                <CSVLink
                    data={userInteractions}
                    headers={csvHeaders}
                    filename="user_interactions.csv"
                    className="download-button"
                >
                    Download Interactions Data
                </CSVLink>
            </div>
        </div>
    );
};

export default ViewMonitoredContent;
