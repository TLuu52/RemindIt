import { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import Calendar from 'react-calendar';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, firestore } from "../../firebase";


const Container = styled('div')(({ theme }) => ({
    '& .react-calendar': {
        background: theme.palette.primary.border,
        border: 'none',
        color: theme.palette.primary.contrastText,
        fontFamily: 'Inter',
        padding: '10px',
        borderRadius: '16px',
        width: '100%',
        '& .react-calendar__navigation .react-calendar__navigation__label': {
            color: theme.palette.primary.contrastText,
            fontWeight: '800',
            fontSize: '16px',
            '& .react-calendar__navigation__label__labelText': {
                fontFamily: 'Inter'
            }
        },
        '& .react-calendar__month-view__weekdays abbr': {
            textDecoration: 'none',
            fontWeight: '500'
        },
        '& .react-calendar__month-view__days__day--weekend, .react-calendar__month-view__days__day': {
            color: theme.palette.primary.contrastText,
            fontWeight: '300'
        },
        '& .react-calendar__month-view__days__day--neighboringMonth': {
            color: 'rgba(255,255,255,.3)'
        },
        '& .react-calendar__tile--now abbr': {
            background: theme.palette.primary.light,
            borderRadius: '50%'
        },
        '& .react-calendar__tile--now': {
            background: 'transparent',
        },
        '& .react-calendar__tile:enabled:hover': {
            backgroundColor: theme.palette.secondary.main
        },
        '& .react-calendar__tile--active abbr': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%'
        },
        '& .react-calendar__tile abbr': {
            height: '40px !important',
            width: '40px !important',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            margin: 'auto'
        },
        '& .react-calendar__tile--active, .react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus': {
            backgroundColor: 'transparent',
        },

        '& .react-calendar__tile--reminder-day': {
            backgroundColor: theme.palette.error.main,
            borderRadius: '50%',
            color: theme.palette.error.contrastText,
            fontWeight: 'bold',
        },

        '& .react-calendar__navigation__arrow': {
            color: theme.palette.primary.light,
            fontSize: '24px',
            fontWeight: '700'
        }
    }

}))

function CustomCalendar({ onChange, value }) {
    const [reminders, setReminders] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                // Create a reference to the "reminders" collection
                const remindersCollectionRef = collection(firestore, 'reminders');

                // Get the current date
                const currentDate = new Date();

                // Get the currently authenticated user
                const user = auth.currentUser;
                if (!user) {
                    // User is not signed in, handle accordingly
                    return;
                }

                // Build the query to fetch reminders for the specific user and current date
                const remindersQuery = query(
                    remindersCollectionRef,
                    where('userId', '==', user.uid),
                    where('date', '>=', Timestamp.fromDate(currentDate))
                );

                // Execute the query and get the query snapshot
                const querySnapshot = await getDocs(remindersQuery);

                // Map the query snapshot to an array of reminder objects
                const fetchedReminders = querySnapshot.docs.map((doc) => doc.data());

                setReminders(fetchedReminders);

                console.log('Fetched reminders:', fetchedReminders); // Log fetched reminders
            } catch (error) {
                console.error('Error fetching reminders:', error);
            }
        };

        fetchReminders();
    }, []);


    const getRemindersForDate = (date) => {
        const formattedDate = date.toDateString();
        const remindersForDate = reminders.filter((reminder) => {
            const reminderDate = new Date(reminder.date.toDate()).toDateString();
            return reminderDate === formattedDate;
        });

        return remindersForDate;
    };

    const tileContent = ({ date }) => {
        const remindersForDate = getRemindersForDate(date);

        return (
            <div style={{ position: 'relative' }}>
                {remindersForDate.length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'red',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                        }}
                    />
                )}
            </div>
        );
    };
    return (
        <Container>
            <Calendar
                onChange={onChange}
                value={value}
                tileContent={tileContent} // Add the tileContent prop
            />
        </Container>
    );
}

export default CustomCalendar;