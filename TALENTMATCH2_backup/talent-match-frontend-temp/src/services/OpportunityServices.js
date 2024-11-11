import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const getAllOpportunities = async () => {
    try {
        const opportunitiesRef = collection(db, 'Opportunities');
        const snapshot = await getDocs(opportunitiesRef);
        const opportunities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return opportunities;
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
    }
};

// Export as named functions
const OpportunityService = {
    getAllOpportunities,
};

export default OpportunityService; // Exporting object assigned to a variable
