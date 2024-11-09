// src/components/Dashboard.js
import React from 'react';
import './Dashboard.css';
import {Link} from "react-router-dom";


function Dashboard() {
    return (
        <div className="dashboard">
            <div className="sidebar">
                <h2>Sidebar</h2>
                <p>Link 1</p>
                <p>Link 2</p>
                <p>Link 3</p>
            </div>
            <div className="main-content">
                <div className="header">
                    Header
                </div>
                <Link to="/search">
                    <button className="search-button">Search</button>
                </Link>
                <div className="content">
                    <h2 className="dashboard-title">Dashboard Content</h2>

                    <div className="dashboard-content">
                        <p>Your dashboard content goes here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
