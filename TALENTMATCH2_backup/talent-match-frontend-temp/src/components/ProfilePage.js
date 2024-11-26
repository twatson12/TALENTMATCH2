import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    console.error('No authenticated user found.');
                    return;
                }

                // Query the `Profile` collection where `UserID` matches the user's UID
                const profileQuery = query(
                    collection(db, 'Profile'),
                    where('UserID', '==', currentUser.uid)
                );
                const querySnapshot = await getDocs(profileQuery);

                if (!querySnapshot.empty) {
                    // Assume there's only one document per UserID
                    const profileData = querySnapshot.docs[0];
                    setProfile({ id: profileData.id, ...profileData.data() });
                } else {
                    console.error('No profile found for this user.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!profile) {
        return <p>Profile not found.</p>;
    }

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-content">
                {profile.Bio && (
                    <p>
                        <strong>Bio:</strong> {profile.Bio}
                    </p>
                )}
                {profile.Portfolio && (
                    <p>
                        <strong>Portfolio:</strong>{' '}
                        <a href={profile.Portfolio} target="_blank" rel="noopener noreferrer">
                            {profile.Portfolio}
                        </a>
                    </p>
                )}
                {profile.Skills && (
                    <div>
                        <strong>Skills:</strong>
                        <ul>
                            {profile.Skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <button
                className="edit-profile-button"
                onClick={() => navigate(`/profile/edit/${profile.id}`)} // Navigate to edit screen
            >
                Edit Profile
            </button>
        </div>
    );
};

export default ProfilePage;

