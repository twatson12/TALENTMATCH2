import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './TalentMatchUserProfilePage.css';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Get the current user
                const user = auth.currentUser;
                if (!user) {
                    alert("User not logged in. Redirecting to login.");
                    navigate('/login');
                    return;
                }

                // Fetch user profile data from Firebase
                const userDoc = await getDoc(doc(db, 'User', user.uid));
                if (userDoc.exists()) {
                    setUserProfile(userDoc.data());
                } else {
                    console.error("User profile not found.");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleBack = () => {
        navigate('/home'); // Navigate back to home/dashboard
    };

    const handleChangePassword = () => {
        navigate('/change-password'); // Redirect to Change Password Page
    };

    const handleChangeEmail = () => {
        navigate('/change-email'); // Redirect to Change Email Page
    };

    if (!userProfile) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="platform-report-page">
            <h1>User Profile</h1>
            <p><strong>First Name:</strong> {userProfile.Fname || 'N/A'}</p>
            <p><strong>Last Name:</strong> {userProfile.Lname || 'N/A'}</p>
            <p><strong>Email:</strong> {userProfile.Email || 'N/A'}</p>
            <p><strong>Role:</strong> {userProfile.RoleName || 'N/A'}</p>
            <p><strong>Subscription Plan:</strong> {userProfile.SubscriptionName || 'N/A'}</p>
            <p><strong>Joined On:</strong> {new Date(userProfile.registrationDate?.seconds * 1000).toLocaleDateString() || 'N/A'}</p>

            <button className="back-button" onClick={handleBack}>Back to Home</button>
            <button className="back-button" onClick={handleChangePassword} style={{ marginLeft: '10px' }}>Change Password</button>
            <button className="back-button" onClick={handleChangeEmail} style={{ marginLeft: '10px' }}>Change Email</button>
        </div>
    );
};

export default UserProfile;
