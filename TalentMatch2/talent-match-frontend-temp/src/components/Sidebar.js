// src/components/Sidebar.js
import React from 'react';
import { FaHome, FaBell, FaUser, FaCalendarAlt } from 'react-icons/fa';

function Sidebar() {
    return (
        <div className="sidebar bg-dark text-white p-4">
            <h2 className="text-center mb-4">TalentMatch</h2>
            <ul className="list-unstyled">
                <li className="mb-3">
                    <FaHome className="me-2" /> Home
                </li>
                <li className="mb-3">
                    <FaCalendarAlt className="me-2" /> Opportunities
                </li>
                <li className="mb-3">
                    <FaBell className="me-2" /> Notifications
                </li>
                <li className="mb-3">
                    <FaUser className="me-2" /> Profile
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;

