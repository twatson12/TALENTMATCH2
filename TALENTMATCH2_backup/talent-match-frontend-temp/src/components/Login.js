import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchUserDetails = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'User', userId));
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                console.error("User document not found in Firestore.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user details from Firestore:", error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            // Sign in the user with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user details from Firestore
            const userDetails = await fetchUserDetails(user.uid);

            if (userDetails) {
                // Check if the user is banned
                if (userDetails.Status && userDetails.Status.toLowerCase() === 'banned') {
                    await auth.signOut(); // Immediately sign out the user
                    setError('Your account has been banned. Please contact support.');
                    return;
                }

                // Check if the role matches the Firestore user's role
                if (userDetails.RoleName && userDetails.RoleName.toLowerCase() === role.toLowerCase()) {
                    // Save role in local storage for session persistence
                    localStorage.setItem('userRole', userDetails.RoleName);

                    // Navigate based on user role
                    switch (role.toLowerCase()) {
                        case 'admin':
                            navigate('/admin-dashboard');
                            break;
                        case 'entertainer':
                            navigate('/entertainer-dashboard');
                            break;
                        case 'talent':
                            navigate('/talent-dashboard');
                            break;
                        case 'moderator':
                            navigate('/moderator-dashboard');
                            break;
                        default:
                            setError("Role not recognized. Please contact support.");
                    }
                } else {
                    setError("Invalid role selection. Please select the correct role.");
                }
            } else {
                setError("User details could not be found. Ensure your account exists.");
            }
        } catch (error) {
            console.error("Error during login:", error.message);
            setError("Invalid login credentials. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
                {error && <p className="error-message">{error}</p>}
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Entertainer">Entertainer</option>
                        <option value="Talent">Talent</option>
                        <option value="Moderator">Moderator</option>
                    </select>
                </div>
                <button type="submit" className="sign-in-button">Log In</button>
                <p className="register-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
