import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './BanUser.css';

const BanUser = () => {
    const [userId, setUserId] = useState('');
    const [reason, setReason] = useState('');
    const [banDuration, setBanDuration] = useState(''); // Optional: specify suspension time
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBanUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!userId.trim()) {
                alert('Please provide a valid User ID.');
                setIsSubmitting(false);
                return;
            }

            const userRef = doc(db, 'Users', userId); // Reference to the user's document

            await updateDoc(userRef, {
                Status: 'Banned',
                BanReason: reason,
                BanDate: new Date().toISOString(),
                BanDuration: banDuration || 'Indefinite', // Optional field
            });

            alert(`User ${userId} has been banned/suspended successfully.`);
        } catch (error) {
            console.error('Error banning user:', error.message);
            alert('Failed to ban/suspend the user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="ban-user-container">
            <h1>Ban or Suspend a User</h1>
            <form onSubmit={handleBanUser}>
                <div>
                    <label>User ID</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter User ID"
                        required
                    />
                </div>
                <div>
                    <label>Reason for Ban</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter the reason for the ban/suspension"
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Ban Duration (optional)</label>
                    <input
                        type="text"
                        value={banDuration}
                        onChange={(e) => setBanDuration(e.target.value)}
                        placeholder="e.g., 7 days, 30 days, Indefinite"
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Ban/Suspend User'}
                </button>
            </form>
        </div>
    );
};

export default BanUser;
