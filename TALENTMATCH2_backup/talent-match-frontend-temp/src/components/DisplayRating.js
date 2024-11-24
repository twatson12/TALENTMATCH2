import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './DisplayRating.css';

const DisplayRating = () => {
const [talents, setTalents] = useState([]);
const [selectedTalent, setSelectedTalent] = useState('');
const [reviews, setReviews] = useState([]);
const [averageRating, setAverageRating] = useState(null);
const [loading, setLoading] = useState(false);

// Fetch talents from the database
useEffect(() => {
    const fetchTalents = async () => {
        try {
            const talentsSnapshot = await getDocs(collection(db, 'User'));
            const talentsData = talentsSnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((talent) => talent.RoleId === 'Talent'); // Filter only talents
            setTalents(talentsData);
        } catch (error) {
            console.error('Error fetching talents:', error.message);
        }
    };

    fetchTalents();
}, []);

// Fetch reviews for the selected talent
const fetchReviews = async (talentId) => {
    setLoading(true);
    try {
        const reviewsRef = collection(db, 'Review');
        const q = query(reviewsRef, where('TalentID', '==', talentId));
        const snapshot = await getDocs(q);
        const reviewsData = snapshot.docs.map((doc) => doc.data());

        setReviews(reviewsData);

        // Calculate average rating
        const totalRatings = reviewsData.reduce((acc, review) => acc + review.Rating, 0);
        const avgRating =
            reviewsData.length > 0 ? (totalRatings / reviewsData.length).toFixed(1) : null;

        setAverageRating(avgRating);
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
    } finally {
        setLoading(false);
    }
};

const handleTalentChange = (e) => {
    const talentId = e.target.value;
    setSelectedTalent(talentId);
    if (talentId) {
        fetchReviews(talentId);
    } else {
        setReviews([]);
        setAverageRating(null);
    }
};

return (
    <div className="reviews-rating-container">
        <h1>Talent Reviews</h1>
        <div>
            <label>Select Talent</label>
            <select
                value={selectedTalent}
                onChange={handleTalentChange}
                className="talent-dropdown"
            >
                <option value="">-- Select a Talent --</option>
                {talents.map((talent) => (
                    <option key={talent.id} value={talent.id}>
                        {`${talent.Fname} ${talent.Lname} (${talent.Email})`}
                    </option>
                ))}
            </select>
        </div>

        {loading ? (
            <p>Loading reviews...</p>
        ) : (
            <>
                {averageRating ? (
                    <div className="average-rating">
                        <h2>Average Rating: {averageRating} / 5</h2>
                    </div>
                ) : (
                    <p>{selectedTalent ? 'No reviews yet for this talent.' : ''}</p>
                )}

                <div className="reviews-list">
                    {reviews.map((review, index) => (
                        <div key={index} className="review-item">
                            <p><strong>Rating:</strong> {review.Rating} / 5</p>
                            <p><strong>Comment:</strong> {review.Comment}</p>
                            <p><em>By: {review.EntertainerID}</em></p>
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
    );
};


export default DisplayRating;
