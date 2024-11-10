import React, { useState } from 'react';
import { db, auth } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './PostOpportunity.css';

const PostOpportunity = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [multimedia, setMultimedia] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handlePostOpportunity = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = auth.currentUser; // Get the currently logged-in user
            if (!user) {
                alert('You must be logged in to post an opportunity.');
                setIsSubmitting(false);
                return;
            }

            await addDoc(collection(db, 'Opportunities'), {
                Title: title,
                Description: description,
                Deadline: Timestamp.fromDate(new Date(deadline)),
                EntertainerID: `/User/${user.uid}`, // Reference to the user's ID
                MultiMedia: multimedia,
                PostDate: Timestamp.now(),
            });

            alert('Opportunity posted successfully!');
            navigate('/dashboard'); // Redirect after successful post
        } catch (error) {
            console.error('Error posting opportunity:', error.message);
            alert('Failed to post opportunity. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="post-opportunity-container">
            <h1>Post an Opportunity</h1>
            <form onSubmit={handlePostOpportunity}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Deadline</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Multimedia</label>
                    <input
                        type="text"
                        value={multimedia}
                        onChange={(e) => setMultimedia(e.target.value)}
                        placeholder="Enter multimedia file name (e.g., Opera.png)"
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Opportunity'}
                </button>
            </form>
        </div>
    );
};

export default PostOpportunity;

