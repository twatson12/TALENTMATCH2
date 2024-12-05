import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfilePage.css';

const ViewProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the user ID from the route

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!id) {
                    console.error('No user ID provided in the URL.');
                    return;
                }

                // Fetch user details from the User collection
                const userDocRef = doc(db, 'User', id);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());
                } else {
                    console.error('No user details found for the provided ID.');
                }

                // Fetch profile data from the Profile collection
                const profileDocRef = doc(db, 'Profile', id); // Assuming profile document ID matches the user ID
                const profileDoc = await getDoc(profileDocRef);

                if (profileDoc.exists()) {
                    setProfile({ id: profileDoc.id, ...profileDoc.data() });
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
    }, [id]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!profile) {
        return <p>Profile not found.</p>;
    }

    return (
        <div className="profile-container">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="back-link">
                Back
            </button>
            {/* Profile Picture */}
            <img src="/img.png" alt="ProfilePic" className="profile-picture" />

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

export default ViewProfilePage;



