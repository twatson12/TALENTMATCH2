import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './TalentSearch.css';

const TalentSearch = () => {
    const [talents, setTalents] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const talentsRef = collection(db, 'users'); // Replace 'users' with the collection where talents are stored
                const talentsQuery = query(talentsRef, where('role', '==', 'talent'));
                const talentsSnapshot = await getDocs(talentsQuery);
                const talentsData = talentsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTalents(talentsData);
            } catch (error) {
                console.error('Error fetching talents:', error);
            }
        };

        fetchTalents();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value.toLowerCase());
    };

    const filteredTalents = talents.filter((talent) =>
        talent.name.toLowerCase().includes(search) || talent.email.toLowerCase().includes(search)
    );

    return (
        <div className="talent-search">
            <h1>Talent Search</h1>
            <input
                type="text"
                placeholder="Search talent by name or email"
                value={search}
                onChange={handleSearch}
                className="search-bar"
            />
            <div className="talent-list">
                {filteredTalents.length > 0 ? (
                    filteredTalents.map((talent) => (
                        <div key={talent.id} className="talent-card">
                            <p><strong>Name:</strong> {talent.name}</p>
                            <p><strong>Email:</strong> {talent.email}</p>
                            {/* Add more fields as needed */}
                        </div>
                    ))
                ) : (
                    <p>No talents found.</p>
                )}
            </div>
        </div>
    );
};

export default TalentSearch;

