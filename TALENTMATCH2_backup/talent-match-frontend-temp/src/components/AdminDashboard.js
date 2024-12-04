import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch users from Firestore
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
                setFilteredUsers(usersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Logout
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

    // Search Filter
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

    // Status Toggle for Users
    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'User', userId);
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateDoc(userRef, { Status: newStatus });

            setUsers(users.map(user => (user.id === userId ? { ...user, Status: newStatus } : user)));
            setFilteredUsers(filteredUsers.map(user => (user.id === userId ? { ...user, Status: newStatus } : user)));
            alert(`User status updated to ${newStatus}.`);
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status.');
        }
    };

    // Approve or Reject Moderator Requests
    const handleModeratorApproval = async (userId, action) => {
        try {
            const userRef = doc(db, 'User', userId);
            const updatedRole = action === 'Approve' ? 'Moderator' : 'User';

            await updateDoc(userRef, { RoleId: updatedRole });

            setUsers(users.map(user => (user.id === userId ? { ...user, RoleId: updatedRole } : user)));
            setFilteredUsers(filteredUsers.map(user => (user.id === userId ? { ...user, RoleId: updatedRole } : user)));
            alert(`Moderator request ${action.toLowerCase()}ed successfully.`);
        } catch (error) {
            console.error(`Error ${action.toLowerCase()}ing moderator request:`, error);
            alert(`Failed to ${action.toLowerCase()} the request.`);
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
                            <th>Actions</th>
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

            <div className="moderator-requests-section">
                <h2>Moderator Requests</h2>
                {users.filter((user) => user.RoleId === 'ModeratorRequest').length > 0 ? (
                    <table className="moderator-requests-table">
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.filter((user) => user.RoleId === 'ModeratorRequest').map((user) => (
                            <tr key={user.id}>
                                <td>{user.Email}</td>
                                <td>{user.Reason || 'No reason provided'}</td>
                                <td>{user.Status || 'Pending'}</td>
                                <td>
                                    <button
                                        onClick={() => handleModeratorApproval(user.id, 'Approve')}
                                        className="approve-button"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleModeratorApproval(user.id, 'Reject')}
                                        className="reject-button"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No pending moderator requests.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
