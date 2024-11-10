import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDoc = await getDoc(doc(db, 'User', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserDetails(userDoc.data());
                        setUpdatedDetails(userDoc.data());
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userRef = doc(db, 'User', currentUser.uid);
                await updateDoc(userRef, updatedDetails);
                setUserDetails(updatedDetails);
                setEditing(false);
                alert('Account updated successfully.');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            alert('Failed to update account.');
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('userRole'); // Clear localStorage role
            navigate('/login');
            alert('Successfully logged out.');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="settings-container">
            <h1>Account Settings</h1>
            {userDetails && (
                <div className="settings-content">
                    {editing ? (
                        <form onSubmit={handleUpdate}>
                            <div className="input-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={updatedDetails.Fname}
                                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, Fname: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={updatedDetails.Lname}
                                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, Lname: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={updatedDetails.Email}
                                    onChange={(e) => setUpdatedDetails({ ...updatedDetails, Email: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Role:</label>
                                <input type="text" value={userDetails.RoleId} disabled />
                            </div>
                            <button type="submit" className="save-button">Save Changes</button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {
                                    setEditing(false);
                                    setUpdatedDetails(userDetails); // Revert changes
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <div>
                            <p><strong>First Name:</strong> {userDetails.Fname}</p>
                            <p><strong>Last Name:</strong> {userDetails.Lname}</p>
                            <p><strong>Email:</strong> {userDetails.Email}</p>
                            <p><strong>Role:</strong> {userDetails.RoleId}</p>
                            <button className="edit-button" onClick={() => setEditing(true)}>Edit Account</button>
                        </div>
                    )}
                    <button className="back-button" onClick={() => navigate('/admin-dashboard')}>
                        Back to Dashboard
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settings;
