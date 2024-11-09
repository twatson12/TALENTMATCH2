// src/services/OpportunityService.js
const BASE_URL = 'http://localhost:3001/api/opportunities'; // Replace with your backend URL

const OpportunityService = {
    getAllOpportunities: async () => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error("Failed to fetch opportunities");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching opportunities from backend:", error);
            return [];
        }
    },
    createOpportunity: async (opportunity) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(opportunity),
            });
            if (!response.ok) {
                throw new Error("Failed to create opportunity");
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error creating opportunity:", error);
        }
    },
    // Add additional methods for update and delete if needed
};

export default OpportunityService;
