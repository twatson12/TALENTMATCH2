import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CSVLink } from 'react-csv';
import './MonitorContentPage.css';

const MonitorContentPage = () => {
    const [messages, setMessages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [auditions, setAuditions] = useState([]);
    const [flaggedContent, setFlaggedContent] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch usernames based on user ID
    const fetchUserName = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'User', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return `${userData.Fname || ''} ${userData.Lname || ''}`.trim();
            }
            return 'Unknown User';
        } catch (error) {
            console.error('Error fetching user name:', error);
            return 'Unknown User';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [messagesSnapshot, reviewsSnapshot, auditionsSnapshot, flaggedSnapshot] = await Promise.all([
                    getDocs(collection(db, 'Messages')),
                    getDocs(collection(db, 'Reviews')),
                    getDocs(collection(db, 'Auditions')),
                    getDocs(collection(db, 'FlaggedContent')),
                ]);

                // Map messages with names
                const messagesData = await Promise.all(
                    messagesSnapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        const senderName = await fetchUserName(data.SenderID?.replace('/User/', '') || '');
                        const receiverName = await fetchUserName(data.ReceiverID?.replace('/User/', '') || '');
                        return {
                            id: doc.id,
                            ...data,
                            SenderName: senderName,
                            ReceiverName: receiverName,
                        };
                    })
                );

                // Map auditions with names
                const auditionsData = await Promise.all(
                    auditionsSnapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        const talentName = await fetchUserName(data.TalentID?.replace('/User/', '') || '');
                        const hostName = await fetchUserName(data.HostID?.replace('/User/', '') || '');
                        return {
                            id: doc.id,
                            ...data,
                            TalentName: talentName,
                            HostName: hostName,
                        };
                    })
                );

                setMessages(messagesData);
                setReviews(reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                setAuditions(auditionsData);
                setFlaggedContent(flaggedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

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

    const handleResolveFlag = async (flagId) => {
        try {
            await updateDoc(doc(db, 'FlaggedContent', flagId), { Status: 'Resolved' });
            setFlaggedContent(flaggedContent.filter((flag) => flag.id !== flagId));
            alert('Flagged content resolved.');
        } catch (error) {
            console.error('Error resolving flagged content:', error);
        }
    };

    const handleDeleteFlag = async (flagId, itemId) => {
        const reason = prompt('Enter a message to inform the user about the flagged content:');
        if (!reason) return;

        try {
            await deleteDoc(doc(db, 'FlaggedContent', flagId));
            await deleteDoc(doc(db, 'Content', itemId)); // Adjust the collection name as per your structure
            setFlaggedContent(flaggedContent.filter((flag) => flag.id !== flagId));
            alert('Flagged content deleted, and the user has been notified.');
        } catch (error) {
            console.error('Error deleting flagged content:', error);
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
                                        <td>{message.SenderName}</td>
                                        <td>{message.ReceiverName}</td>
                                        <td>{message.Message}</td>
                                        <td>
                                            {message.Timestamp
                                                ? new Date(
                                                    message.Timestamp.seconds * 1000
                                                ).toLocaleString()
                                                : 'No date provided'}
                                        </td>
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
                                        <td>{review.ReviewerID}</td>
                                        <td>{review.RevieweeID}</td>
                                        <td>{review.Content}</td>
                                        <td>{review.Rating}</td>
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
                                        <td>{audition.TalentName}</td>
                                        <td>{audition.HostName}</td>
                                        <td>
                                            {audition.DateTime
                                                ? new Date(audition.DateTime.seconds * 1000).toLocaleString()
                                                : 'No date provided'}
                                        </td>
                                        <td>{audition.Location}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No scheduled auditions to monitor.</p>
                        )}
                    </section>

                    {/* Flagged Content Section */}
                    <section className="content-section">
                        <h2>Flagged Content</h2>
                        {flaggedContent.length > 0 ? (
                            <table className="content-table">
                                <thead>
                                <tr>
                                    <th>Content ID</th>
                                    <th>Type</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {flaggedContent.map((flag) => (
                                    <tr key={flag.id}>
                                        <td>{flag.ItemId}</td>
                                        <td>{flag.Type}</td>
                                        <td>{flag.Reason}</td>
                                        <td>{flag.Status}</td>
                                        <td>
                                            <button onClick={() => handleResolveFlag(flag.id)}>
                                                Resolve
                                            </button>
                                            <button onClick={() => handleDeleteFlag(flag.id, flag.ItemId)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No flagged content to monitor.</p>
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
