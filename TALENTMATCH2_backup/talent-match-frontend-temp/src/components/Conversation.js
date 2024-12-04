import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const Conversation = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const messagesRef = collection(db, 'Messages');
                const q = query(messagesRef, where('ConversationID', '==', conversationId));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMessages(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching conversation:', error);
            }
        };

        fetchConversation();
    }, [conversationId]);

    const handleReply = async () => {
        if (!reply.trim()) return;

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to send a message.');
                return;
            }

            const messagesRef = collection(db, 'Messages');
            await addDoc(messagesRef, {
                ConversationID: conversationId,
                SenderID: `/User/${user.uid}`,
                RecipientID: messages[0]?.SenderID || 'Unknown', // Reply to the first sender
                Message: reply,
                Timestamp: serverTimestamp(),
            });

            setReply('');
            alert('Message sent!');
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    return (
        <div className="conversation-container">
            <h2>Conversation</h2>
            {loading ? (
                <p>Loading conversation...</p>
            ) : (
                <div className="messages-thread">
                    {messages.map((msg) => (
                        <div key={msg.id} className="message-item">
                            <p><strong>{msg.SenderID}</strong>: {msg.Message}</p>
                            <p className="timestamp">
                                {new Date(msg.Timestamp.seconds * 1000).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply..."
            ></textarea>
            <button onClick={handleReply}>Send Reply</button>
        </div>
    );
};

export default Conversation;
