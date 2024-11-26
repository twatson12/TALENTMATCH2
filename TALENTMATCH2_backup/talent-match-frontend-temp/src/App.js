import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Welcome from './components/Welcome';
import Search from './components/Search';
import EntertainerDashboard from './components/EntertainerDashboard';
import Settings from './components/Settings';
import PostOpportunity from './components/PostOpportunity';
import TalentDashboard from './components/TalentDashboard';
import ModeratorDashboard from './components/ModeratorDashboard';
import RegisterTalent from './components/RegisterTalent';
import ApplyOpportunity from './components/ApplyOpportunity';
import PlatformReport from './components/PlatformReport'; // Import PlatformReport
import BanUser from './components/BanUser'; // Import BanUser
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RateAndReview from "./components/RateAndReview";
import DisplayRating from "./components/DisplayRating";
import EditProfile from "./components/EditProfile";
import TalentMatchUserProfilePage from "./components/TalentMatchUserProfilePage";

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
                    <Route path="/register-talent" element={<RegisterTalent />} />
                    <Route path="/apply/:opportunityId" element={<ApplyOpportunity />} />
                    <Route path="/RateAndReview" element={<RateAndReview />} />
                    <Route path="/DisplayRating" element={<DisplayRating />} />
                    {/* Add the Platform Report route */}
                    <Route path="/platform-report" element={<PlatformReport />} />
                    {/* Add the Ban User route */}
                    <Route path="/ban-user" element={<BanUser />} />
                    <Route path="/Profile" element={<TalentMatchUserProfilePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
