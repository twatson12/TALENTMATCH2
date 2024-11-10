import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { db, auth } from '../config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'User');
                const usersSnapshot = await getDocs(usersRef);
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('userRole'); // Clear localStorage role
            navigate('/login'); // Redirect to login page
            alert('Successfully logged out!');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out.');
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'User', userId);
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateDoc(userRef, { Status: newStatus });

            setUsers(users.map(user =>
                user.id === userId ? { ...user, Status: newStatus } : user
            ));
            alert(`User status updated to ${newStatus}.`);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="admin-dashboard">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h1>Admin Dashboard</h1>
                <ul>
                    <li><button onClick={() => navigate('/settings')}>Settings</button></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>

            <div className="user-list">
                <h2>All Users</h2>
                {users.length > 0 ? (
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Subscription Plan</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.Email}</td>
                                <td>{`${user.Fname} ${user.Lname}`}</td>
                                <td>{user.RoleId || 'Unknown'}</td>
                                <td>{user.SubscriptionPlanId || 'Unknown'}</td>
                                <td>{user.Status || 'active'}</td>
                                <td>
                                    <button
                                        onClick={() => handleStatusToggle(user.id, user.Status)}
                                        className={user.Status === 'active' ? 'deactivate-button' : 'activate-button'}
                                    >
                                        {user.Status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
