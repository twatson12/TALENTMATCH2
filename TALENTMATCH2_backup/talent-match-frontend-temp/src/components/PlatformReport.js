import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import './PlatformReport.css';

const PlatformReport = () => {
    const [platformStats, setPlatformStats] = useState(null);
    const navigate = useNavigate();
    const canvasRef = useRef(null); // Reference for the canvas element

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
        if (platformStats) {
            drawChart(platformStats.roleStats); // Draw chart when stats are available
        }
    }, [platformStats]);

    const drawChart = (roleStats) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const data = Object.values(roleStats);
        const labels = Object.keys(roleStats);

        const colors = ['#3b3b98', '#6a1b9a', '#ff6384', '#36a2eb', '#cc65fe'];
        const total = data.reduce((sum, value) => sum + value, 0);
        let startAngle = 0;

        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(150, 150); // Center of the pie chart
            ctx.arc(150, 150, 100, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            // Add labels
            const middleAngle = startAngle + sliceAngle / 2;
            const labelX = 150 + Math.cos(middleAngle) * 120; // Position labels outside the chart
            const labelY = 150 + Math.sin(middleAngle) * 120;
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText(labels[index], labelX - 20, labelY);

            startAngle += sliceAngle;
        });
    };

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
                        <canvas ref={canvasRef} width="300" height="300"></canvas>
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
