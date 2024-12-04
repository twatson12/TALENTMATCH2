import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const MessageTalent = ({ talentID }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        setIsSending(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to send messages.");
                return;
            }

            const messageRef = collection(db, 'Messages');
            await addDoc(messageRef, {
                SenderID: `/Users/${user.uid}`,
                ReceiverID: `/Users/${talentID}`,
                MessageText: message,
                Timestamp: serverTimestamp(),
            });

            alert('Message sent successfully!');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            <textarea
                placeholder="Write your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
            />
            <button onClick={handleSendMessage} disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Message'}
            </button>
        </div>
    );
};

export default MessageTalent;
