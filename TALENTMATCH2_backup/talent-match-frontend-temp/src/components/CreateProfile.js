import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import "./CreateProfile.css";
const CreateProfile = () => {
    const [bio, setBio] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [skills, setSkills] = useState(['']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const checkProfileStatus = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    setError('No authenticated user found.');
                    return navigate('/login'); // Redirect to login if not logged in
                }

                const userDocRef = doc(db, 'User', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && userDoc.data().isProfileCreated) {
                    // Redirect to dashboard if profile is already created
                    const userRole = userDoc.data().RoleName?.toLowerCase();
                    switch (userRole) {
                        case 'talent':
                            navigate('/talent-dashboard');
                            break;
                        case 'entertainer':
                            navigate('/entertainer-dashboard');
                            break;
                        default:
                            navigate('/'); // Fallback for other roles
                    }
                }
            } catch (error) {
                console.error('Error checking profile status:', error);
                setError('Failed to check profile status.');
            } finally {
                setLoading(false); // End loading state
            }
        };

        checkProfileStatus();
    }, [navigate]);

    const handleSkillChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

    const addSkillField = () => {
        setSkills([...skills, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError('No user is logged in. Please log in to create your profile.');
                return;
            }

            const profileDocRef = doc(db, 'Profile', currentUser.uid);

            // Create a new profile document in Firestore
            await setDoc(profileDocRef, {
                Bio: bio,
                Portfolio: portfolio,
                Skills: skills.filter(skill => skill.trim() !== ''), // Remove empty skill fields
                UserID: currentUser.uid,
            });

            // Update the isProfileCreated field in the User document
            const userDocRef = doc(db, 'User', currentUser.uid);
            await updateDoc(userDocRef, { isProfileCreated: true });

            setSuccess(true);

            // Redirect to the appropriate dashboard after profile creation
            const userRole = localStorage.getItem('userRole')?.toLowerCase();
            switch (userRole) {
                case 'talent':
                    navigate('/talent-dashboard');
                    break;
                case 'entertainer':
                    navigate('/entertainer-dashboard');
                    break;
                default:
                    navigate('/'); // Fallback to home or general dashboard
            }
        } catch (error) {
            console.error('Error creating profile:', error);
            setError('Failed to create your profile. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show a loading indicator while checking profile status
    }

    return (
        <div className="create-profile-container">
            <form className="create-profile-form" onSubmit={handleSubmit}>
                <h1>Create Your Profile</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Profile created successfully!</p>}
                <div className="input-group">
                    <label>Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Portfolio</label>
                    <input
                        type="text"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Skills</label>
                    {skills.map((skill, index) => (
                        <input
                            key={index}
                            type="text"
                            value={skill}
                            onChange={(e) => handleSkillChange(index, e.target.value)}
                            placeholder={`Skill ${index + 1}`}
                        />
                    ))}
                    <button type="button" onClick={addSkillField}>
                        Add Skill
                    </button>
                </div>
                <button type="submit" className="create-profile-button">Create Profile</button>
            </form>
        </div>
    );
};

export default CreateProfile;

