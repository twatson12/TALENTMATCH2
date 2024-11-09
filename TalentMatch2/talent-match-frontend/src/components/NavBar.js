// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ role }) => {
    return (
        <nav>
            <ul>
                {role === 'admin' && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
                {role === 'entertainer' && <li><Link to="/talent-search">Search Talent</Link></li>}
                {role === 'talent' && <li><Link to="/home">Home</Link></li>}
            </ul>
        </nav>
    );
};

export default Navbar;
