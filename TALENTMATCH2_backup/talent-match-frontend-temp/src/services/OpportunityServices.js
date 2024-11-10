// src/services/OpportunityServices.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to fetch opportunities from Firestore
const getOpportunities = async () => {
    try {
        const opportunitiesRef = collection(db, 'Opportunity');
        const snapshot = await getDocs(opportunitiesRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        throw error;
    }
};

export default {
    getOpportunities,
};
