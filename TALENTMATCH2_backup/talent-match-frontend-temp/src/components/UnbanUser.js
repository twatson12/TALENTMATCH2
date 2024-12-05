import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './UnbanUser.css'; // Reuse the same CSS file

const UnbanUser = () => {
    const [userId, setUserId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUnbanUser = async (e) => {
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
                Status: 'Active',
                BanReason: null, // Clear the ban reason
                BanDate: null,   // Clear the ban date
                BanDuration: null, // Clear the ban duration
            });

            alert(`User ${userId} has been unbanned successfully.`);
        } catch (error) {
            console.error('Error unbanning user:', error.message);
            alert('Failed to unban the user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="ban-user-container">
            <h1>Unban a User</h1>
            <form onSubmit={handleUnbanUser}>
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
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Unban User'}
                </button>
            </form>
        </div>
    );
};

export default UnbanUser;