import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getFirestore, collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { auth } from "../../firebase";

function NotificationBox() {
  const [inbox, setInbox] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const remindersPerPage = 10; // Adjust the number of reminders per page as needed

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const db = getFirestore();
        const remindersCollection = collection(db, 'reminders');

        const user = auth.currentUser;
        if (!user) {
          // User is not signed in, handle accordingly
          return;
        }

        const remindersQuery = query(
          remindersCollection,
          where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(remindersQuery, (snapshot) => {
          const reminders = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            const dueDate = data.date.toDate();
            const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24));
            data.daysUntilDue = daysUntilDue;
            data.id = doc.id; // Assign the ID property from the document ID
            reminders.push(data);
          });
          setInbox(reminders);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    if (auth.currentUser) {
      fetchReminders();
    }
  }, [auth]);

  const filterReminders = (value) => {
    setFilter(value);
  };

  const sortReminders = (sortBy) => {
    setSortBy(sortBy);
  };

  const filteredReminders = () => {
    const currentDate = new Date();
    let filtered = inbox.filter(
      (reminder) => reminder.daysUntilDue >= 0 && reminder.date.toDate() >= currentDate
    );

    switch (filter) {
      case 'week':
        filtered = filtered.filter((reminder) => reminder.daysUntilDue <= 7);
        break;
      case 'month':
        filtered = filtered.filter((reminder) => reminder.daysUntilDue <= 30);
        break;
      case 'year':
        filtered = filtered.filter((reminder) => reminder.daysUntilDue <= 365);
        break;
      default:
        break;
    }

    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'length') {
      filtered.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    }

    return filtered;
  };

  const displayedReminders = filteredReminders();

  // Calculate pagination
  const indexOfLastReminder = currentPage * remindersPerPage;
  const indexOfFirstReminder = indexOfLastReminder - remindersPerPage;
  const remindersToShow = displayedReminders.slice(indexOfFirstReminder, indexOfLastReminder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const pageNumbers = Math.ceil(displayedReminders.length / remindersPerPage);

    if (pageNumbers === 1) {
      return null; // No need to show pagination if there's only one page
    }

    return (
      <Box>
        {Array.from({ length: pageNumbers }, (_, index) => index + 1).map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            disabled={currentPage === pageNumber}
          >
            {pageNumber}
          </Button>
        ))}
      </Box>
    );
  };

  const renderReminder = (reminder, index) => {
    const isDueSoon = reminder.daysUntilDue <= 7; // Customize the threshold for "due soon" as needed

    const handleReminderClick = () => {
      setSelectedReminder(reminder);
    };

    const handleMarkComplete = async () => {
      try {
        const db = getFirestore();

        // Ensure reminder ID exists before proceeding
        if (!reminder.id) {
          console.error('Reminder ID is missing');
          return;
        }

        const reminderRef = doc(db, 'reminders', reminder.id);

        // Delete the reminder document from Firestore
        await deleteDoc(reminderRef);

        // Update the inbox state by filtering out the completed reminder
        const updatedInbox = inbox.filter((r) => r !== reminder);
        setInbox(updatedInbox);
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    };

    return (
      <Box key={index} display="flex" alignItems="center">
        <Button onClick={handleReminderClick} style={{ textTransform: 'none' }}>
          <Typography variant="body2">
            {reminder.title} - {reminder.daysUntilDue} days until due{' '}
            {isDueSoon && <span style={{ color: 'red' }}>⚠️</span>}
          </Typography>
        </Button>
        <Button variant="contained" color="primary" onClick={handleMarkComplete}>
          Mark as Complete
        </Button>
      </Box>
    );
  };

  if (displayedReminders.length === 0) {
    return (
      <Box>
        <Typography variant="body1">No notifications</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box>
        <Button onClick={() => filterReminders('all')} disabled={filter === 'all'}>
          All
        </Button>
        <Button onClick={() => filterReminders('week')} disabled={filter === 'week'}>
          Week
        </Button>
        <Button onClick={() => filterReminders('month')} disabled={filter === 'month'}>
          Month
        </Button>
        <Button onClick={() => filterReminders('year')} disabled={filter === 'year'}>
          Year
        </Button>
      </Box>
      <Box>
        <Button onClick={() => sortReminders('title')} disabled={sortBy === 'title'}>
          Sort by Title
        </Button>
        <Button onClick={() => sortReminders('length')} disabled={sortBy === 'length'}>
          Sort by Length
        </Button>
      </Box>
      {remindersToShow.map(renderReminder)}
      {renderPaginationButtons()}
    </Box>
  );
}

export default NotificationBox;