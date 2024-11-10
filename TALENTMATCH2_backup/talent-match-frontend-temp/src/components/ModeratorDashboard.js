import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './ModeratorDashboard.css';

const ModeratorDashboard = () => {
    const [flaggedContent, setFlaggedContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlaggedContent = async () => {
            try {
                const flaggedRef = collection(db, 'FlaggedContent');
                const flaggedSnapshot = await getDocs(flaggedRef);
                const flaggedData = flaggedSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFlaggedContent(flaggedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching flagged content:', error);
                setLoading(false);
            }
        };

        fetchFlaggedContent();
    }, []);

    const handleApproveContent = async (contentId) => {
        try {
            // Update the flagged content's status to "Approved"
            const contentRef = doc(db, 'FlaggedContent', contentId);
            await updateDoc(contentRef, { status: 'Approved' });

            setFlaggedContent(flaggedContent.filter(content => content.id !== contentId));
            alert('Content approved successfully.');
        } catch (error) {
            console.error('Error approving content:', error);
            alert('Failed to approve content.');
        }
    };

    const handleRemoveContent = async (contentId) => {
        try {
            // Delete the flagged content from the database
            const contentRef = doc(db, 'FlaggedContent', contentId);
            await deleteDoc(contentRef);

            setFlaggedContent(flaggedContent.filter(content => content.id !== contentId));
            alert('Content removed successfully.');
        } catch (error) {
            console.error('Error removing content:', error);
            alert('Failed to remove content.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="moderator-dashboard">
            <h1>Moderator Dashboard</h1>

            <div className="flagged-content">
                <h2>Flagged Content</h2>
                {flaggedContent.length > 0 ? (
                    <table className="content-table">
                        <thead>
                        <tr>
                            <th>Content</th>
                            <th>Flagged By</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {flaggedContent.map((content) => (
                            <tr key={content.id}>
                                <td>{content.text || 'Unknown content'}</td>
                                <td>{content.flaggedBy || 'Anonymous'}</td>
                                <td>{content.status || 'Pending'}</td>
                                <td>
                                    <button onClick={() => handleApproveContent(content.id)}>Approve</button>
                                    <button onClick={() => handleRemoveContent(content.id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No flagged content found.</p>
                )}
            </div>
        </div>
    );
};

export default ModeratorDashboard;
