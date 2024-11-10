import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);

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

    const handleDelete = async (userId) => {
        try {
            await deleteDoc(doc(db, 'User', userId));
            setUsers(users.filter(user => user.id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, 'User', editUser.id);
            await updateDoc(userRef, {
                Email: editUser.Email,
                Fname: editUser.Fname,
                Lname: editUser.Lname,
                RoleId: editUser.RoleId,
                SubscriptionPlanId: editUser.SubscriptionPlanId,
            });
            setUsers(users.map(user => user.id === editUser.id ? editUser : user));
            setEditUser(null);
            alert('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <h2>All Users</h2>
            <table className="user-table">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Subscription Plan</th>
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
                        <td>
                            <button onClick={() => setEditUser(user)}>Edit</button>
                            <button onClick={() => handleDelete(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {editUser && (
                <div className="edit-modal">
                    <h2>Edit User</h2>
                    <form onSubmit={handleEdit}>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={editUser.Email}
                                onChange={(e) => setEditUser({ ...editUser, Email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>First Name:</label>
                            <input
                                type="text"
                                value={editUser.Fname}
                                onChange={(e) => setEditUser({ ...editUser, Fname: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={editUser.Lname}
                                onChange={(e) => setEditUser({ ...editUser, Lname: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Role:</label>
                            <input
                                type="text"
                                value={editUser.RoleId}
                                onChange={(e) => setEditUser({ ...editUser, RoleId: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Subscription Plan:</label>
                            <input
                                type="text"
                                value={editUser.SubscriptionPlanId}
                                onChange={(e) => setEditUser({ ...editUser, SubscriptionPlanId: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
