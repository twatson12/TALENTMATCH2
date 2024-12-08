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

            <div className="subscription-plans-section">
                <h2>Manage Subscription Plans</h2>
                {editingPlan ? (
                    <form onSubmit={handleUpdatePlan} className="edit-plan-form">
                        <div>
                            <label>Plan Name:</label>
                            <input
                                type="text"
                                value={editingPlan.Name}
                                onChange={(e) =>
                                    setEditingPlan({ ...editingPlan, Name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                value={editingPlan.Price}
                                onChange={(e) =>
                                    setEditingPlan({ ...editingPlan, Price: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Features (comma-separated):</label>
                            <textarea
                                value={editingPlan.Features.join(', ')}
                                onChange={(e) =>
                                    setEditingPlan({
                                        ...editingPlan,
                                        Features: e.target.value.split(',').map((feature) => feature.trim()),
                                    })
                                }
                            />
                        </div>
                        <button type="submit">Update Plan</button>
                        <button type="button" onClick={() => setEditingPlan(null)}>
                            Cancel
                        </button>
                    </form>
                ) : (
                    <table className="subscription-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Features</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subscriptions.map((plan) => (
                            <tr key={plan.id}>
                                <td>{plan.Name}</td>
                                <td>${plan.Price}</td>
                                <td>
                                    <ul>
                                        {plan.Features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <button onClick={() => handleEditPlan(plan)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
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
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.Email}</td>
                                <td>{`${user.Fname || ''} ${user.Lname || ''}`}</td>
                                <td>{user.RoleId || 'Unknown'}</td>
                                <td>{user.SubscriptionPlanId || 'Unknown'}</td>
                                <td>{user.Status || 'active'}</td>
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

