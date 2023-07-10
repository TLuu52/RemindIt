import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, ButtonGroup, InputLabel } from '@mui/material';
import { getFirestore, collection, onSnapshot, query, where, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { auth } from "../../firebase";
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { ArrowRightIcon } from '@mui/x-date-pickers';




function NotificationBox({ updateReminders }) {
  const [inbox, setInbox] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const remindersPerPage = 10; // Adjust the number of reminders per page as needed
  const theme = useTheme()

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
            const dueDate = new Date(data.date);
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
      (reminder) => reminder.daysUntilDue >= 0 && new Date(reminder.date) >= currentDate
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
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


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
        updateReminders()
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    };
    const hours = Number(reminder.duration.split(':')[0]);
    const minutes = Number(reminder.duration.split(':')[1]);
    const time = formatAMPM(new Timestamp(reminder.time.seconds, reminder.time.nanoseconds).toDate())

    return (
      <div onClick={handleReminderClick}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr) auto', background: theme.palette.primary.dark, padding: '20px 10px', borderRadius: '8px', marginBottom: '10px', alignItems: 'center', gridColumnGap: '10px', }}
      >

        <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: '600' }}>{reminder.title}</Typography>
        <Typography variant="body1" sx={{ background: reminder.category.color, maxWidth: '180px', padding: '5px' }}>{reminder.category.name}</Typography>
        <Typography variant="body1">{time}</Typography>
        <Typography variant="body1">{reminder.priority.toUpperCase()}</Typography> {/* Display the priority */}
        <Typography variant="body1">{hours} hour(s) {minutes} minutes</Typography>
        <Button variant="contained" color="primary" onClick={handleMarkComplete}>
          Mark as Complete
        </Button>
        <p style={{ margin: '0px 10px', display: 'inline-block', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <ArrowRightIcon />
        </p>
      </div>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '900px' }}>
      <Typography variant='h3' paddingLeft={'5px'}>Upcoming Reminders</Typography>
      <hr />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button onClick={() => filterReminders('all')} disabled={filter === 'all'}>All</Button>
          <Button onClick={() => filterReminders('week')} disabled={filter === 'week'}>Week</Button>
          <Button onClick={() => filterReminders('month')} disabled={filter === 'month'}>Month</Button>
          <Button onClick={() => filterReminders('year')} disabled={filter === 'year'}>Year</Button>
        </ButtonGroup>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <InputLabel>Sort By:</InputLabel>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button onClick={() => sortReminders('title')} disabled={sortBy === 'title'}>Tite</Button>
            <Button onClick={() => sortReminders('length')} disabled={sortBy === 'length'}>Length</Button>
          </ButtonGroup>
        </div>
      </Box>
      <Box sx={{ overflow: 'auto', flexGrow: '1', }}>
        {remindersToShow.map(renderReminder)}
        {renderPaginationButtons()}
      </Box>
    </Box>
  );
}

export default NotificationBox;