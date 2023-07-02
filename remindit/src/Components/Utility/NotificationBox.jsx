import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

function NotificationBox() {
  const [inbox, setInbox] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const remindersPerPage = 10; // Adjust the number of reminders per page as needed

  useEffect(() => {
    const db = getFirestore();
    const remindersCollection = collection(db, 'reminders');

    const unsubscribe = onSnapshot(remindersCollection, (snapshot) => {
      const reminders = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const dueDate = data.date.toDate();
        const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24));
        data.daysUntilDue = daysUntilDue;
        reminders.push(data);
      });
      setInbox(reminders);
    });

    return () => unsubscribe();
  }, []);

  const filterReminders = (value) => {
    setFilter(value);
  };

  const sortReminders = (sortBy) => {
    setSortBy(sortBy);
  };

  const filteredReminders = () => {
    let filtered = inbox;
    switch (filter) {
      case 'week':
        filtered = filtered.filter((reminder) => reminder.daysUntilDue >= 0 && reminder.daysUntilDue <= 7);
        break;
      case 'month':
        filtered = filtered.filter((reminder) => reminder.daysUntilDue >= 0 && reminder.daysUntilDue <= 30);
        break;
      case 'year':
        filtered = filtered.filter((reminder) => reminder.daysUntilDue >= 0 && reminder.daysUntilDue <= 365);
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
      {remindersToShow.map((notification, index) => (
        <Typography key={index} variant="body2">
          {notification.title} - {notification.daysUntilDue} days until due
        </Typography>
      ))}
      {renderPaginationButtons()}
    </Box>
  );
}

export default NotificationBox;