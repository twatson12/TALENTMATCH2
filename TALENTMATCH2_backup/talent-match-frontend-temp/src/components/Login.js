import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    // Fetch user details directly from the User document
    const fetchUserDetails = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'User', userId)); // Correct Firestore collection name
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    roleName: userData.RoleName, // Access RoleName directly
                    subName: userData.SubscriptionName, // Access SubscriptionName directly
                };
            } else {
                console.error("User document not found");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Authenticate user with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch the user's role and subscription details
            const userDetails = await fetchUserDetails(user.uid);

            if (userDetails && userDetails.roleName.toLowerCase() === role.toLowerCase()) {
                // Store role in local storage or global state
                localStorage.setItem('userRole', userDetails.roleName); // Example: "admin"

                console.log("Role:", userDetails.roleName);
                console.log("Subscription Plan:", userDetails.subName);

                // Role-based redirection
                if (role.toLowerCase() === 'admin') {
                    console.log("Navigating to Admin Dashboard");
                    navigate('/admin-dashboard'); // Redirect admin to admin dashboard
                } else if (role.toLowerCase() === 'entertainer') {
                    console.log("Navigating to Entertainer Dashboard");
                    navigate('/entertainer-dashboard'); // Redirect entertainers to entertainer dashboard
                } else if (role.toLowerCase() === 'talent') {
                    console.log("Navigating to Talent Dashboard");
                    navigate('/talent-dashboard'); // Redirect talent users to talent dashboard
                } else if (role.toLowerCase() === 'moderator') {
                    console.log("Navigating to Moderator Dashboard");
                    navigate('/moderator-dashboard'); // Redirect moderators to moderator dashboard
                } else {
                    console.error("Role not recognized");
                    alert("Role not recognized. Please contact support.");
                }
            } else {
                alert("Invalid role selection. Please select the correct role.");
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
            alert("Invalid login credentials. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
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
                        <option value="Entertainer">Entertainer</option>
                        <option value="Admin">Admin</option>
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
