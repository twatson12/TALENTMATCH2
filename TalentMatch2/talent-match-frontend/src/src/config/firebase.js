// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
    apiKey: "AIzaSyBmQZPAK4rSvy7R0-YmL4O4kcBC7GKX2SI",
    authDomain: "talent-match-2137d.firebaseapp.com",
    databaseURL: "https://talent-match-2137d-default-rtdb.firebaseio.com",
    projectId: "talent-match-2137d",
    storageBucket: "talent-match-2137d.appspot.com",
    messagingSenderId: "334530429482",
    appId: "1:334530429482:web:1e616dbfb8f248a7b6b953",
    measurementId: "G-FRS1Z5JNKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore and assign to `db`

// Uncomment if you want to use analytics
// const analytics = getAnalytics(app);

// Export both `auth` and `db` so they can be used in other components
export { auth, db };
