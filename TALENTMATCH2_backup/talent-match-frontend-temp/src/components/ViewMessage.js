import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import './ViewMessage.css';

const ViewMessage = () => {
    const { messageId } = useParams(); // Get message ID from URL
    const [message, setMessage] = useState(null); // Current message details
    const [replyText, setReplyText] = useState('');
    const [senderName, setSenderName] = useState('Unknown');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch message details
        const fetchMessageDetails = async () => {
            try {
                const messageDoc = await getDoc(doc(db, 'Messages', messageId));
                if (messageDoc.exists()) {
                    const messageData = messageDoc.data();
                    setMessage(messageData);

                    // Fetch sender's name
                    const senderId = messageData.SenderID.replace('/Users/', '');
                    const senderDoc = await getDoc(doc(db, 'User', senderId));
                    setSenderName(
                        senderDoc.exists()
                            ? `${senderDoc.data().Fname} ${senderDoc.data().Lname}`
                            : 'Unknown Sender'
                    );
                } else {
                    alert('Message not found.');
                    navigate('/talent-dashboard');
                }
            } catch (error) {
                console.error('Error fetching message details:', error);
            }
        };

        fetchMessageDetails();
    }, [messageId, navigate]);

    const handleReply = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to reply.');
                return;
            }

            if (!replyText.trim()) {
                alert('Reply cannot be empty.');
                return;
            }

            const messagesRef = collection(db, 'Messages');
            await addDoc(messagesRef, {
                SenderID: `/Users/${user.uid}`,
                RecipientID: message?.SenderID,
                Message: replyText,
                Timestamp: serverTimestamp(),
            });

            alert('Reply sent!');
            setReplyText('');
            navigate('/talent-dashboard'); // Navigate back after replying
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Failed to send reply.');
        }
    };

    return (
        <div className="view-message-container">
            <h2>Message from {senderName}</h2>
            {message ? (
                <div className="message-details">
                    <p><strong>Message:</strong> {message.Message}</p>
                    <p><strong>Sent:</strong> {new Date(message.Timestamp.seconds * 1000).toLocaleString()}</p>
                </div>
            ) : (
                <p>Loading message...</p>
            )}

            <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="reply-input"
            ></textarea>
            <button onClick={handleReply} className="send-reply-button">
                Send Reply
            </button>
        </div>
    );
};

export default ViewMessage;
