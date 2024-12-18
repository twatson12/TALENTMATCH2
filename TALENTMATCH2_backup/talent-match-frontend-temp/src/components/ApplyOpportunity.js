import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import {collection, addDoc, Timestamp, getDoc, doc} from 'firebase/firestore';
import './ApplyOpportunity.css';

const ApplyOpportunity = () => {
    const { opportunityId } = useParams();
    const [name, setName] = useState(''); // State for name
    const [email, setEmail] = useState(''); // State for email
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                alert('You must be logged in to apply.');
                setIsSubmitting(false);
                return;
            }

            // Fetch Opportunity Data (Optional): This approach fetches the opportunity title before adding the application.
            const opportunityDoc = await getDoc(doc(db, 'Opportunities', opportunityId));
            const opportunityTitle = opportunityDoc.exists() ? opportunityDoc.data().Title : 'Unknown Opportunity';

            await addDoc(collection(db, 'Applications'), {
                OpportunityID: `${opportunityId}`,
                TalentID: `/User/${user.uid}`,
                Name: name, // Save the name
                Email: email, // Save the email
                Status: 'Submitted',
                SubmissionDate: Timestamp.now(),
                Message: message,
                FileName: file ? file.name : null,
                OpportunityTitle: opportunityTitle, // Add Opportunity Title
            });

            alert('Application submitted successfully!');
            navigate('/talent-dashboard'); // Redirect after application submission
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="apply-opportunity-container">
            <h1>Apply for Opportunity</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write a message about why you're applying."
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Upload File (Optional):</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
};

export default ApplyOpportunity;
