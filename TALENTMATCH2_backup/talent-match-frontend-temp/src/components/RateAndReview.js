import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './RateAndReview.css';

const RateAndReview = () => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [talents, setTalents] = useState([]);
    const [selectedTalent, setSelectedTalent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const talentsSnapshot = await getDocs(collection(db, 'User'));
                const talentsData = talentsSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((talent) => talent.RoleId === 'Talent'); // Filter for talents if RoleId is defined
                setTalents(talentsData);
            } catch (error) {
                console.error('Error fetching talents:', error.message);
            }
        };

        fetchTalents();
    }, []);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to leave a review.');
                setIsSubmitting(false);
                return;
            }

            await addDoc(collection(db, 'Review'), {
                TalentID: selectedTalent,
                Rating: parseInt(rating, 10),
                Comment: review,
                EntertainerID: `/User/${user.uid}`,
            });

            alert('Review submitted successfully!');
            setRating(0);
            setReview('');
            setSelectedTalent('');
        } catch (error) {
            console.error('Error submitting review:', error.message);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rate-review-container">
            <h1>Rate and Review Talent</h1>
            <form onSubmit={handleSubmitReview}>
                <div>
                    <label>Select Talent</label>
                    <select
                        value={selectedTalent}
                        onChange={(e) => setSelectedTalent(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select a Talent
                        </option>
                        {talents.map((talent) => (
                            <option key={talent.id} value={talent.id}>
                                {`${talent.Fname} ${talent.Lname} (${talent.Email})`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Rating (1-5)</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Review</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here"
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default RateAndReview;

