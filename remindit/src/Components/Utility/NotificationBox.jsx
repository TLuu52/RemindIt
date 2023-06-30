import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

function NotificationBox() {
  const [inbox, setInbox] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const remindersCollection = collection(db, 'reminders');

    const unsubscribe = onSnapshot(remindersCollection, (snapshot) => {
      const reminders = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        reminders.push(data);
      });
      setInbox(reminders);
    });

    return () => unsubscribe();
  }, []);

  if (inbox.length === 0) {
    return (
      <Box>
        <Typography variant="body1">No notifications</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {inbox.map((notification, index) => (
        <Typography key={index} variant="body2">
          {notification.title}
        </Typography>
      ))}
    </Box>
  );
}

export default NotificationBox;