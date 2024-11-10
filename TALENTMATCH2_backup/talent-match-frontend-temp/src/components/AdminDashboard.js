import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [moderatorRequests, setModeratorRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsersAndRequests = async () => {
            try {
                const usersRef = collection(db, 'User');
                const usersSnapshot = await getDocs(usersRef);
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const requestsRef = collection(db, 'ModeratorRequests');
                const requestsSnapshot = await getDocs(requestsRef);
                const requestsData = requestsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setUsers(usersData);
                setModeratorRequests(requestsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setLoading(false);
            }
        };

        fetchUsersAndRequests();
    }, []);

    const handleApproveModerator = async (requestId, userId) => {
        try {
            const userRef = doc(db, 'User', userId);
            await updateDoc(userRef, { RoleId: 'Moderator' });

            const requestRef = doc(db, 'ModeratorRequests', requestId);
            await deleteDoc(requestRef);

            setModeratorRequests(moderatorRequests.filter(req => req.id !== requestId));
            alert('Moderator request approved successfully.');
        } catch (error) {
            console.error('Error approving moderator request:', error.message);
        }
    };

    const handleAssignModerator = async (userId) => {
        try {
            const userRef = doc(db, 'User', userId);
            await updateDoc(userRef, { RoleId: 'Moderator' });

            setUsers(users.map(user => user.id === userId ? { ...user, RoleId: 'Moderator' } : user));
            alert('User assigned as Moderator.');
        } catch (error) {
            console.error('Error assigning moderator:', error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="moderator-requests">
                <h2>Moderator Requests</h2>
                {moderatorRequests.length > 0 ? (
                    moderatorRequests.map((request) => (
                        <div key={request.id} className="request-card">
                            <p><strong>Name:</strong> {request.name}</p>
                            <p><strong>Email:</strong> {request.email}</p>
                            <button onClick={() => handleApproveModerator(request.id, request.userId)}>Approve</button>
                        </div>
                    ))
                ) : (
                    <p>No moderator requests found.</p>
                )}
            </div>

            <div className="user-list">
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
                                {user.RoleId !== 'Moderator' && (
                                    <button onClick={() => handleAssignModerator(user.id)}>Make Moderator</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
