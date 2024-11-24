import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Chart from 'chart.js/auto'; // Import the Chart.js library
import './PlatformReport.css';

const PlatformReport = () => {
    const [platformStats, setPlatformStats] = useState(null);
    const navigate = useNavigate();
    const chartRef = useRef(null); // Reference for the chart canvas
    let chartInstance = useRef(null); // To store the Chart.js instance

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'User');
                const usersSnapshot = await getDocs(usersRef);
                const users = usersSnapshot.docs.map((doc) => doc.data());
                calculateStats(users);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
    }, []);

    const calculateStats = (users) => {
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.Status === 'active').length;
        const inactiveUsers = totalUsers - activeUsers;
        const roleStats = users.reduce((acc, user) => {
            const role = user.RoleId || 'Unknown';
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        setPlatformStats({
            totalUsers,
            activeUsers,
            inactiveUsers,
            roleStats,
        });
    };

    useEffect(() => {
        if (platformStats && chartRef.current) {
            // Destroy the previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Create a new chart
            chartInstance.current = new Chart(chartRef.current, {
                type: 'pie',
                data: {
                    labels: Object.keys(platformStats.roleStats),
                    datasets: [
                        {
                            data: Object.values(platformStats.roleStats),
                            backgroundColor: ['#3b3b98', '#6a1b9a', '#ff6384', '#36a2eb', '#cc65fe'],
                            hoverBackgroundColor: ['#2a297a', '#4d106e', '#ff4b5c', '#2288c5', '#a14fdc'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                },
            });
        }
    }, [platformStats]);

    return (
        <div className="platform-report-page">
            <h1>Platform Usage Report</h1>
            {platformStats ? (
                <div>
                    <p>Total Users: {platformStats.totalUsers}</p>
                    <p>Active Users: {platformStats.activeUsers}</p>
                    <p>Inactive Users: {platformStats.inactiveUsers}</p>

                    <div className="chart-container">
                        <h2>Users by Role</h2>
                        {/* Chart.js canvas element */}
                        <canvas ref={chartRef}></canvas>
                    </div>

                    <button onClick={() => navigate('/admin-dashboard')} className="back-button">
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <p>Loading platform statistics...</p>
            )}
        </div>
    );
};

export default PlatformReport;
