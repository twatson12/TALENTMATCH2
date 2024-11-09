import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import "../components/Register.css";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleName, setRoleName] = useState("");
    const [subscriptionName, setSubscriptionName] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Create the user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user data in Firestore
            await setDoc(doc(db, "User", user.uid), {
                Email: email,
                Fname: firstName,
                Lname: lastName,
                Password: password,
                RegistrationDate: new Date(),
                RoleName: roleName, // Save the role name
                SubscriptionName: subscriptionName, // Save the subscription name
            });

            alert("Account created successfully!");
            navigate("/login"); // Redirect to log in after successful registration
        } catch (error) {
            console.error("Error during registration:", error.message);
            setError(error.message);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handleRegister}>
                {error && <p className="error">{error}</p>}
                <div className="input-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="input-group">
                    <label htmlFor="roleName">Role</label>
                    <select
                        id="roleName"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Entertainer">Entertainer</option>
                        <option value="Talent">Talent</option>
                        <option value="Moderator">Moderator</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="subscriptionName">Subscription Plan</label>
                    <select
                        id="subscriptionName"
                        value={subscriptionName}
                        onChange={(e) => setSubscriptionName(e.target.value)}
                        required
                    >
                        <option value="">Select Subscription Plan</option>
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>
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
