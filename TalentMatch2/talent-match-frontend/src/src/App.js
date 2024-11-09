import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Welcome from "./components/Welcome";
import AdminDashboard from "./components/AdminDashboard";
import TalentSearch from './components/TalentSearch';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const userRole = localStorage.getItem('userRole'); // Fetch the user's role from local storage

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/admin-dashboard"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/talent-search"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={['entertainer', 'admin']}>
                                <TalentSearch />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={['admin', 'entertainer', 'talent']}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute role={userRole} allowedRoles={['talent', 'entertainer', 'admin']}>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
