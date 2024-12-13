import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [editingPlan, setEditingPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Fetch users and subscriptions from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersSnapshot, subscriptionsSnapshot] = await Promise.all([
                    getDocs(collection(db, 'User')),
                    getDocs(collection(db, 'SubscriptionPlans')),
                ]);

                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const subscriptionData = subscriptionsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setUsers(usersData);
                setFilteredUsers(usersData);
                setSubscriptions(subscriptionData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('userRole');
            navigate('/login');
            alert('Successfully logged out!');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Failed to log out.');
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query) {
            const filtered = users.filter(
                (user) =>
                    user.Email.toLowerCase().includes(query) ||
                    user.Fname?.toLowerCase().includes(query) ||
                    user.Lname?.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const handleEditPlan = (plan) => {
        setEditingPlan(plan);
    };

    const handleUpdatePlan = async (e) => {
        e.preventDefault();
        try {
            const planRef = doc(db, 'SubscriptionPlans', editingPlan.id);
            await updateDoc(planRef, {
                Name: editingPlan.Name,
                Price: editingPlan.Price,
                Features: editingPlan.Features,
            });

            alert('Subscription plan updated successfully!');
            setEditingPlan(null);
        } catch (error) {
            console.error('Error updating subscription plan:', error);
            alert('Failed to update subscription plan.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'User', userId);
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateDoc(userRef, { Status: newStatus });

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, Status: newStatus } : user
                )
            );

            setFilteredUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, Status: newStatus } : user
                )
            );

            alert(`User status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status.');
        }
    };


    return (
        <div className="admin-dashboard">
            <nav className="navbar">
                <h1>Admin Dashboard</h1>
                <ul>
                    <li><button onClick={() => navigate('/settings')}>Settings</button></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>

            <div className="view-platform-section">
                <button
                    onClick={() => navigate('/platform-report')}
                    className="view-platform-button"
                >
                    View Platform Usage
                </button>
                <button
                    onClick={() => navigate('/subscriptions')}
                    className="view-platform-button"
                >
                    Edit Subscriptions
                </button>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-bar"
                />
            </div>


            <div className="user-list">
                <h2>All Users</h2>
                {filteredUsers.length > 0 ? (
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Subscription Plan</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.Email}</td>
                                <td>{`${user.Fname || ''} ${user.Lname || ''}`}</td>
                                <td>{`${user.RoleName || ''}`}</td>
                                <td>{user.SubscriptionName || 'Unknown'}</td>
                                <td>{user.Status || 'active'}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleToggleStatus(user.id, user.Status || 'active')
                                        }
                                        className={`toggle-status-button ${
                                            user.Status === 'active' ? 'deactivate' : 'activate'
                                        }`}
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