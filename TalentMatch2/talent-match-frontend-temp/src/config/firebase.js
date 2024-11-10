// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// If you need analytics, uncomment the next line
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBmQZPAK4rSvy7R0-YmL4O4kcBC7GKX2SI",
    authDomain: "talent-match-2137d.firebaseapp.com",
    databaseURL: "https://talent-match-2137d-default-rtdb.firebaseio.com",
    projectId: "talent-match-2137d",
    storageBucket: "talent-match-2137d.firebasestorage.app",
    messagingSenderId: "334530429482",
    appId: "1:334530429482:web:1e616dbfb8f248a7b6b953",
    measurementId: "G-FRS1Z5JNKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Uncomment if you want to use analytics
// const analytics = getAnalytics(app);

// Export only `auth` if that’s what your components need
export { auth };
