import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import firebase from './config/firebase';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Welcome from "./components/Welcome";
import Search from "./components/Search";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<Search/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
