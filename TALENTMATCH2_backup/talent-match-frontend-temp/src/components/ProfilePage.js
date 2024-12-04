import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
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

                // Fetch user details from the User collection
                const userDocRef = doc(db, 'User', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());
                } else {
                    console.error('No user details found.');
                }

                // Query the Profile collection where UserID matches the user's UID
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
            {/* Back Button */}
            <button
                onClick={() => navigate('/talent-dashboard')}
                className="back-link"
            >
                Back
            </button>
            {/* Profile Picture */}
            <img
                src="/img.png"
                alt="ProfilePic"
                className="profile-picture"
            />


            <div className="profile-content">
                {userDetails && (
                    <h1>
                        <strong></strong> {userDetails.Fname} {userDetails.Lname}
                    </h1>
                )}
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


