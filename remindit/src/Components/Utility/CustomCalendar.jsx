import { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material';
import Calendar from 'react-calendar';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, firestore } from "../../firebase";
import { UserContext } from '../../App';

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
    const { user } = useContext(UserContext)
    const [recurringReminders, setRecurringReminders] = useState([]);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const remindersCollectionRef = collection(firestore, 'reminders');
                const currentDate = new Date().toLocaleDateString('en-us');
                const user = auth.currentUser;
                if (!user) {
                    // User is not signed in, handle accordingly
                    return;
                }

                const remindersQuery = query(
                    remindersCollectionRef,
                    where('userId', '==', user.uid),
                );

                const querySnapshot = await getDocs(remindersQuery);

                const fetchedReminders = querySnapshot.docs.map((doc) => doc.data());
                const filteredReminders = fetchedReminders.filter(
                    (reminder) => reminder.recurringOption && reminder.recurringOption !== ''
                );

                const updatedReminders = [
                    ...fetchedReminders,
                    ...getRecurringReminders(filteredReminders, currentDate),
                ];

                setReminders(fetchedReminders.filter((r) => {
                    return new Date(currentDate) <= new Date(r.date)
                }));
                setRecurringReminders(filteredReminders.filter((r) => {
                    return new Date(currentDate) <= new Date(r.date)
                }));
            } catch (error) {
                console.error('Error fetching reminders:', error);
            }
        };
        if (user.currentUser) {
            setTimeout(() => {
                fetchReminders();
            }, 400);
        }
    }, [user.currentUser, auth]);

    const getRecurringReminders = (recurringReminders, currentDate) => {
        const updatedReminders = [];

        recurringReminders.forEach((reminder) => {
            let recurringDuration = 0;
            if (reminder.recurringOption === '1 week') {
                recurringDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
            } else if (reminder.recurringOption === '1 month') {
                recurringDuration = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
            } else if (reminder.recurringOption === '1 year') {
                recurringDuration = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
            }

            let nextRecurringDate = new Date(new Date(reminder.date).getTime() + recurringDuration);

            while (nextRecurringDate <= currentDate) {
                updatedReminders.push({
                    ...reminder,
                    date: Timestamp.fromDate(nextRecurringDate),
                });

                nextRecurringDate = new Date(nextRecurringDate.getTime() + recurringDuration);
            }
        });

        return updatedReminders;
    };

    const getRemindersForDate = (date) => {
        const formattedDate = date.toDateString();
        const remindersForDate = reminders.filter((reminder) => {
            const reminderDate = new Date(reminder.date).toDateString();
            return reminderDate === formattedDate;
        });

        return remindersForDate;
    };

    const tileContent = ({ date }) => {
        const formattedDate = date.toDateString();
        const remindersForDate = reminders.filter((reminder) => {
            const reminderDate = new Date(reminder.date).toDateString();
            return reminderDate === formattedDate;
        });

        const recurringRemindersForDate = recurringReminders.filter((reminder) => {
            const reminderDate = new Date(reminder.date).toDateString();
            return reminderDate === formattedDate;
        });

        const totalReminders = [...remindersForDate, ...recurringRemindersForDate];

        return (
            <div style={{ position: 'relative' }}>
                {totalReminders.length > 0 && (
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