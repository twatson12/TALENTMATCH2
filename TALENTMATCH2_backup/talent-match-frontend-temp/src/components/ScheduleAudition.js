import React, { useState } from 'react';
import { auth, db } from '../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const ScheduleAudition = ({ talentID }) => {
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSchedule = async () => {
        setIsSaving(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to schedule an audition.");
                return;
            }

            const auditionsRef = collection(db, 'Auditions');
            await addDoc(auditionsRef, {
                OrganizerID: `/Users/${user.uid}`,
                TalentID: `/Users/${talentID}`,
                DateTime: dateTime,
                Location: location,
                Timestamp: serverTimestamp(),
                Status: 'Pending Confirmation',
            });

            alert('Audition scheduled successfully!');
            setDateTime('');
            setLocation('');
        } catch (error) {
            console.error('Error scheduling audition:', error);
            alert('Error scheduling audition');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                placeholder="Select date and time"
            />
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
            />
            <button onClick={handleSchedule} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Schedule Audition'}
            </button>
        </div>
    );
};

export default ScheduleAudition;
