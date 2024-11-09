// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; // Ensure this path is correct
import { collection, getDocs } from 'firebase/firestore';
import './Dashboard.css';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState([]); // State to hold fetched data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'yourCollectionName')); // Replace with your collection name
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setDashboardData(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h2>Menu</h2>
                <p>Applications</p>
                <p>Uploads</p>
                <p>Talent</p>
            </div>
            <div className="main-content">
                <div className="header">
                    Header
                </div>
                <div className="content">
                    <h2 className="dashboard-title">Dashboard</h2>
                    <div className="dashboard-content">
                        {dashboardData.length > 0 ? (
                            dashboardData.map(item => (
                                <div key={item.id} className="data-item">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    {/* Add more fields as needed based on your Firestore data structure */}
                                </div>
                            ))
                        ) : (
                            <p>Please navigate to your respective place</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
