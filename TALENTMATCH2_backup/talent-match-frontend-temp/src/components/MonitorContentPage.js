import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CSVLink } from 'react-csv';
import './MonitorContentPage.css';

const MonitorContentPage = () => {
    const [messages, setMessages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [auditions, setAuditions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch monitored data
                const [messagesSnapshot, reviewsSnapshot, auditionsSnapshot] = await Promise.all([
                    getDocs(collection(db, 'Messages')),
                    getDocs(collection(db, 'Reviews')),
                    getDocs(collection(db, 'Auditions')),
                ]);

                setMessages(messagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setReviews(reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setAuditions(auditionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching monitored content:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFlag = async (itemId, type) => {
        const reason = prompt(`Enter the reason for flagging this ${type}:`);
        if (!reason) return;

        try {
            await addDoc(collection(db, 'FlaggedContent'), {
                ItemId: itemId,
                Type: type,
                Reason: reason,
                Status: 'Pending',
                Timestamp: new Date(),
            });
            alert(`${type} flagged successfully.`);
        } catch (error) {
            console.error('Error flagging item:', error);
            alert(`Failed to flag ${type}.`);
        }
    };

    return (
        <div className="monitor-content-page">
            <header className="page-header">
                <h1>Monitor Content</h1>
            </header>

            {loading ? (
                <p>Loading monitored content...</p>
            ) : (
                <>
                    {/* Messaging Section */}
                    <section className="content-section">
                        <h2>Messages</h2>
                        {messages.length > 0 ? (
                            <table className="content-table">
                                <thead>
                                <tr>
                                    <th>Sender</th>
                                    <th>Receiver</th>
                                    <th>Message</th>
                                    <th>Timestamp</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {messages.map((message) => (
                                    <tr key={message.id}>
                                        <td>{message.sender}</td>
                                        <td>{message.receiver}</td>
                                        <td>{message.content}</td>
                                        <td>{new Date(message.timestamp).toLocaleString()}</td>
                                        <td>
                                            <button onClick={() => handleFlag(message.id, 'Message')}>
                                                Flag
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No messages to monitor.</p>
                        )}
                    </section>

                    {/* Reviews Section */}
                    <section className="content-section">
                        <h2>Reviews</h2>
                        {reviews.length > 0 ? (
                            <table className="content-table">
                                <thead>
                                <tr>
                                    <th>Reviewer</th>
                                    <th>Reviewee</th>
                                    <th>Content</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.id}>
                                        <td>{review.reviewer}</td>
                                        <td>{review.reviewee}</td>
                                        <td>{review.content}</td>
                                        <td>{review.rating}</td>
                                        <td>
                                            <button onClick={() => handleFlag(review.id, 'Review')}>
                                                Flag
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No reviews to monitor.</p>
                        )}
                    </section>

                    {/* Scheduled Auditions Section */}
                    <section className="content-section">
                        <h2>Scheduled Auditions</h2>
                        {auditions.length > 0 ? (
                            <table className="content-table">
                                <thead>
                                <tr>
                                    <th>Talent</th>
                                    <th>Host</th>
                                    <th>Date/Time</th>
                                    <th>Location</th>
                                </tr>
                                </thead>
                                <tbody>
                                {auditions.map((audition) => (
                                    <tr key={audition.id}>
                                        <td>{audition.talent}</td>
                                        <td>{audition.host}</td>
                                        <td>{new Date(audition.datetime).toLocaleString()}</td>
                                        <td>{audition.location}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No scheduled auditions to monitor.</p>
                        )}
                    </section>

                    {/* Download Section */}
                    <section className="download-section">
                        <h2>Download Monitored Data</h2>
                        <CSVLink
                            data={[...messages, ...reviews, ...auditions]}
                            headers={[
                                { label: 'Type', key: 'type' },
                                { label: 'Content', key: 'content' },
                                { label: 'Sender/Reviewer', key: 'sender' },
                                { label: 'Receiver/Reviewee', key: 'receiver' },
                                { label: 'Timestamp', key: 'timestamp' },
                            ]}
                            filename="monitored_content.csv"
                            className="download-button"
                        >
                            Download All Data
                        </CSVLink>
                    </section>
                </>
            )}
        </div>
    );
};

export default MonitorContentPage;
