// src/components/Register.js
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../components/Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Create user using Firebase Auth
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Account created successfully!');
            navigate('/dashboard'); // Redirect after successful registration
        } catch (error) {
            console.error("Error creating account:", error.message);
            setError(error.message);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handleRegister}>
                {error && <p className="error">{error}</p>}
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">Register</button>
                <p className="existing-user">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
