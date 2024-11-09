import React, {useEffect, useState} from 'react';
import * as db from "@firebase/firestore";
import './Dashboard.css';

function Search() {

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Fetch users from Firestore on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userCollection = await db.collection('User').get();
                const usersData = userCollection.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
                setFilteredUsers(usersData); // Initially, show all users
            } catch (error) {
                console.error('Error fetching users: ', error);
            }
        };
        fetchUsers();
    }, []);

    // Handle search input change and filter users based on search term
    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        // Filter users based on name or email
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(term.toLowerCase()) ||
            user.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className="search-container">
            <h2>Search Users</h2>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name or email"
                className="search-input"
            />

            <div className="user-list">
                {filteredUsers.length === 0 ? (
                    <p>No users found</p>
                ) : (
                    filteredUsers.map(user => (
                        <div key={user.id} className="user-item">
                            <p><strong>{user.Fname}</strong></p>
                            <p>{user.Email}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Search;




