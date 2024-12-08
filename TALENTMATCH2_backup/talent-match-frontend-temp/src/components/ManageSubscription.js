import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './ManageSubscriptions.css';
import { useNavigate } from 'react-router-dom';

const ManageSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [editingPlan, setEditingPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch subscription plans from Firestore
    const fetchSubscriptions = async () => {
        try {
            const subscriptionsSnapshot = await getDocs(collection(db, 'Subscription'));
            const subscriptionData = subscriptionsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSubscriptions(subscriptionData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleEditPlan = (plan) => {
        setEditingPlan(plan);
    };

    const handleUpdatePlan = async (e) => {
        e.preventDefault();
        try {
            const planRef = doc(db, 'Subscription', editingPlan.id);
            await updateDoc(planRef, {
                Name: editingPlan.Name,
                Price: editingPlan.Price,
                Features: editingPlan.Features,
            });

            // Update the subscriptions state immediately
            setSubscriptions((prevSubscriptions) =>
                prevSubscriptions.map((plan) =>
                    plan.id === editingPlan.id ? editingPlan : plan
                )
            );

            alert('Subscription plan updated successfully!');
            setEditingPlan(null);
        } catch (error) {
            console.error('Error updating subscription plan:', error);
            alert('Failed to update subscription plan.');
        }
    };

    if (loading) {
        return <p>Loading subscription plans...</p>;
    }

    return (
        <div className="manage-subscriptions-container">
            <h1>Manage Subscription Plans</h1>
            <button onClick={() => navigate(-1)} className="back-link">
                Back
            </button>
            {editingPlan ? (
                <form onSubmit={handleUpdatePlan} className="edit-plan-form">
                    <div>
                        <label>Plan Name:</label>
                        <input
                            type="text"
                            value={editingPlan.Name}
                            onChange={(e) =>
                                setEditingPlan({ ...editingPlan, Name: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={editingPlan.Price}
                            onChange={(e) =>
                                setEditingPlan({ ...editingPlan, Price: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label>Features (comma-separated):</label>
                        <textarea
                            value={editingPlan.Features.join(', ')}
                            onChange={(e) =>
                                setEditingPlan({
                                    ...editingPlan,
                                    Features: e.target.value.split(',').map((feature) => feature.trim()),
                                })
                            }
                        />
                    </div>
                    <button type="submit">Update Plan</button>
                    <button type="button" onClick={() => setEditingPlan(null)}>
                        Cancel
                    </button>
                </form>
            ) : (
                <table className="subscription-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Features</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subscriptions.map((plan) => (
                        <tr key={plan.id}>
                            <td>{plan.Name}</td>
                            <td>${plan.Price}</td>
                            <td>
                                <ul>
                                    {plan.Features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <button onClick={() => handleEditPlan(plan)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageSubscriptions;



