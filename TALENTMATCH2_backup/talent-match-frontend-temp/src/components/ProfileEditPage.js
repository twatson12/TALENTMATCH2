import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfileEditPage.css';

const ProfileEditPage = () => {
    const { profileId } = useParams(); // Extract profile ID from URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState('');
    const [newPortfolio, setNewPortfolio] = useState('');
    const [newBio, setNewBio] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileRef = doc(db, 'Profile', profileId);
                const profileSnapshot = await getDoc(profileRef);

                if (profileSnapshot.exists()) {
                    const profileData = profileSnapshot.data();
                    setProfile(profileData);
                    setNewPortfolio(profileData.Portfolio || '');
                    setNewBio(profileData.Bio || '');
                } else {
                    console.error('Profile not found.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId]);

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) {
            alert('Skill cannot be empty.');
            return;
        }

        try {
            setIsUpdating(true);
            const profileRef = doc(db, 'Profile', profileId);
            await updateDoc(profileRef, {
                Skills: arrayUnion(newSkill),
            });
            setProfile((prevProfile) => ({
                ...prevProfile,
                Skills: [...(prevProfile.Skills || []), newSkill],
            }));
            setNewSkill('');
            alert('Skill added successfully!');
        } catch (error) {
            console.error('Error adding skill:', error);
            alert('Failed to add skill. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePortfolio = async (e) => {
        e.preventDefault();
        if (!newPortfolio.trim()) {
            alert('Portfolio URL cannot be empty.');
            return;
        }

        try {
            setIsUpdating(true);
            const profileRef = doc(db, 'Profile', profileId);
            await updateDoc(profileRef, {
                Portfolio: newPortfolio,
            });
            alert('Portfolio updated successfully!');
        } catch (error) {
            console.error('Error updating portfolio:', error);
            alert('Failed to update portfolio. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateBio = async (e) => {
        e.preventDefault();
        if (!newBio.trim()) {
            alert('Bio cannot be empty.');
            return;
        }

        try {
            setIsUpdating(true);
            const profileRef = doc(db, 'Profile', profileId);
            await updateDoc(profileRef, {
                Bio: newBio,
            });
            alert('Bio updated successfully!');
        } catch (error) {
            console.error('Error updating bio:', error);
            alert('Failed to update bio. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (!profile) {
        return <p>Profile not found.</p>;
    }

    return (
        <div className="profile-edit-container">
            <h1>Edit Profile</h1>
            <form onSubmit={handleAddSkill}>
                <div className="input-group">
                    <label>Add a Skill:</label>
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Enter a new skill"
                    />
                </div>
                <button type="submit" className="save-button" disabled={isUpdating}>
                    {isUpdating ? 'Adding Skill...' : 'Add Skill'}
                </button>
            </form>

            <form onSubmit={handleUpdatePortfolio}>
                <div className="input-group">
                    <label>Update Portfolio:</label>
                    <input
                        type="url"
                        value={newPortfolio}
                        onChange={(e) => setNewPortfolio(e.target.value)}
                        placeholder="Enter new portfolio URL"
                    />
                </div>
                <button type="submit" className="save-button" disabled={isUpdating}>
                    {isUpdating ? 'Updating Portfolio...' : 'Update Portfolio'}
                </button>
            </form>

            <form onSubmit={handleUpdateBio}>
                <div className="input-group">
                    <label>Update Bio:</label>
                    <textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        placeholder="Enter your bio"
                        rows="4"
                    ></textarea>
                </div>
                <button type="submit" className="save-button" disabled={isUpdating}>
                    {isUpdating ? 'Updating Bio...' : 'Update Bio'}
                </button>
            </form>
            <button className="back-button" onClick={() => navigate('/profile')}>
                Back to Profile
            </button>
        </div>
    );
};

export default ProfileEditPage;

