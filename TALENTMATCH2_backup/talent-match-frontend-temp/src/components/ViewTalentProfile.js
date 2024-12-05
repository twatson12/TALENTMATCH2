import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ViewTalentProfile = () => {
    const { talentId } = useParams(); // Assuming `talentId` is passed in the route parameter
    const [profile, setProfile] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTalentProfile = async () => {
            try {
                if (!talentId) {
                    console.error('No talent ID provided.');
                    return;
                }

                // Fetch talent user details from the User collection
                const userDocRef = doc(db, 'User', talentId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());
                } else {
                    console.error('No user details found for this talent.');
                }

                // Fetch profile details from the Profile collection where UserID matches the talentId
                const profileQuery = query(
                    collection(db, 'Profile'),
                    where('UserID', '==', talentId)
                );
                const querySnapshot = await getDocs(profileQuery);

                if (!querySnapshot.empty) {
                    // Assume there's only one document per UserID
                    const profileData = querySnapshot.docs[0];
                    setProfile({ id: profileData.id, ...profileData.data() });
                } else {
                    console.error('No profile found for this talent.');
                }
            } catch (error) {
                console.error('Error fetching talent profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTalentProfile();
    }, [talentId]);

    if (loading) {
        return <p>Loading talent profile...</p>;
    }

    if (!profile) {
        return <p>Talent profile not found.</p>;
    }

    return (
        <div className="profile-container">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)} // Go back to the previous page
                className="back-link"
            >
                Back
            </button>

            {/* Profile Picture */}
            <img
                src="/img.png" // Replace with talent's profile picture if available
                alt="ProfilePic"
                className="profile-picture"
            />

            <div className="profile-content">
                {userDetails && (
                    <h1>
                        <strong>Name:</strong> {userDetails.Fname} {userDetails.Lname}
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
        </div>
    );
};

export default ViewTalentProfile;
