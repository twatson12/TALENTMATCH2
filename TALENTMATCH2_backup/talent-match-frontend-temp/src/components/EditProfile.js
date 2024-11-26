import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase'; // Assuming Firebase is used
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './EditProfile.css';

const EditProfile = () => {
    const [email, setEmail] = useState('');
    const [subscriptionPlan, setSubscriptionPlan] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch user data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    alert('You must be logged in to edit your profile.');
                    return;
                }

                const userDoc = await getDoc(doc(db, 'User', user.uid)); // Assuming 'User' collection
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setEmail(userData.Email || '');
                    setSubscriptionPlan(userData.SubscriptionPlan || 'Basic'); // Default plan
                }
            } catch (error) {
                console.error('Error fetching profile:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to update your profile.');
                return;
            }

            // Update user document in Firestore
            await updateDoc(doc(db, 'User', user.uid), {
                Email: email,
                SubscriptionPlan: subscriptionPlan,
            });

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error.message);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <form onSubmit={handleUpdateProfile}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="subscription-plan">Subscription Plan</label>
                    <select
                        id="subscription-plan"
                        value={subscriptionPlan}
                        onChange={(e) => setSubscriptionPlan(e.target.value)}
                        required
                    >
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                        <option value="Pro">Pro</option>
                    </select>
                </div>
                <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
