// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute Component
const ProtectedRoute = ({ role, allowedRoles, children }) => {
    // Check if the user's role matches any of the allowed roles
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />; // Redirect to login if unauthorized
    }

    return children; // Render the children components if authorized
};

export default ProtectedRoute;
