// src/config/firebaseAdmin.js
const admin = require('firebase-admin');

// Replace this path with the path to your Firebase service account JSON file
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

module.exports = { auth };