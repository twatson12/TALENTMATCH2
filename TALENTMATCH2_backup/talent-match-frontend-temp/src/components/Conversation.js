import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
} from 'firebase/firestore';
import './Conversation.css';

const Conversation = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [senderMap, setSenderMap] = useState({});
    const [recipientName, setRecipientName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversation = () => {
            const messagesRef = collection(db, 'Messages');
            const q = query(messagesRef, where('ConversationID', '==', conversationId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(data);
                setLoading(false);
            });
            return () => unsubscribe();
        };

        fetchConversation();
    }, [conversationId]);

    useEffect(() => {
        const fetchSenderNames = async () => {
            const uniqueUserIds = [...new Set(messages.map((msg) => msg.SenderID))];
            const nameMap = {};
            for (const userId of uniqueUserIds) {
                const userDoc = await getDoc(doc(db, 'User', userId.replace('/User/', '')));
                nameMap[userId] = userDoc.exists()
                    ? `${userDoc.data().Fname} ${userDoc.data().Lname}`
                    : 'Unknown User';
            }
            setSenderMap(nameMap);

            if (messages.length > 0) {
                const recipientId =
                    messages[0]?.RecipientID === `/User/${auth.currentUser.uid}`
                        ? messages[0]?.SenderID
                        : messages[0]?.RecipientID;
                if (recipientId) {
                    const userDoc = await getDoc(doc(db, 'User', recipientId.replace('/User/', '')));
                    setRecipientName(userDoc.exists() ? `${userDoc.data().Fname} ${userDoc.data().Lname}` : 'Unknown User');
                }
            }
        };

        if (messages.length > 0) fetchSenderNames();
    }, [messages]);

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
                RecipientID: messages[0]?.SenderID || 'Unknown',
                MessageText: reply,
                Timestamp: serverTimestamp(),
            });

            setReply('');
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    return (
        <div className="conversation-container">
            <h2>Conversation with {recipientName}</h2>
            {loading ? (
                <p>Loading conversation...</p>
            ) : (
                <div className="messages-thread">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message-item ${
                                msg.SenderID === `/User/${auth.currentUser.uid}` ? 'my-message' : 'other-message'
                            }`}
                        >
                            <p><strong>{senderMap[msg.SenderID]}</strong>: {msg.MessageText}</p>
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
                className="reply-input"
            ></textarea>
            <button onClick={handleReply} className="send-reply-button">
                Send Reply
            </button>
        </div>
    );
};

export default Conversation;
