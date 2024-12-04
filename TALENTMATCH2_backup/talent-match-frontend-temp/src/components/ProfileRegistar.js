import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";

const ProfileRegister = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleName, setRoleName] = useState("");
    const [subscriptionName, setSubscriptionName] = useState("");
    const [bio, setBio] = useState(""); // Profile-specific field
    const [portfolio, setPortfolio] = useState(""); // Profile-specific field
    const [skills, setSkills] = useState([]); // Profile-specific field
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Create the user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save the user data in the "User" Firestore collection
            await setDoc(doc(db, "User", user.uid), {
                Email: email,
                Fname: firstName,
                Lname: lastName,
                Password: password,
                RegistrationDate: new Date(),
                RoleName: roleName,
                SubscriptionName: subscriptionName,
            });

            // Save the profile data in the "Profile" Firestore collection
            await setDoc(doc(db, "Profile", user.uid), {
                UserID: user.uid,
                Bio: bio,
                Portfolio: portfolio,
                Skills: skills,
            });

            alert("Account and profile created successfully!");
            navigate("/login"); // Redirect to login page after successful registration
        } catch (error) {
            console.error("Error during registration:", error.message);
            setError(error.message);
        }
    };

    return (
        <div className="register-container">
            <h1>Register and Create Profile</h1>
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
                {/* Profile-specific fields */}
                <div className="input-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="portfolio">Portfolio (URL)</label>
                    <input
                        type="url"
                        id="portfolio"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="skills">Skills (comma-separated)</label>
                    <input
                        type="text"
                        id="skills"
                        value={skills.join(",")}
                        onChange={(e) => setSkills(e.target.value.split(","))}
                    />
                </div>
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
};

export default ProfileRegister;
