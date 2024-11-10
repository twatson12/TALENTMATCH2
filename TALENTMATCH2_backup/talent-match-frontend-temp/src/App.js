import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Welcome from './components/Welcome';
import Search from './components/Search';
import EntertainerDashboard from './components/EntertainerDashboard';
import './styles/App.css';
import Settings from './components/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostOpportunity from './components/PostOpportunity';
import TalentDashboard from './components/TalentDashboard'; // Add this line
import ModeratorDashboard from './components/ModeratorDashboard'; // Add this line



function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/entertainer-dashboard" element={<EntertainerDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/talent-dashboard" element={<TalentDashboard />} />
                    <Route path="/moderator-dashboard" element={<ModeratorDashboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/post-opportunity" element={<PostOpportunity />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
