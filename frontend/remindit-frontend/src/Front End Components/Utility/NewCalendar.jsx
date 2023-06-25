import { ButtonGroup, Button, Typography, styled, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, firestore } from "../../firebase";

const Top = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
})
const Left = styled('div')({
    display: 'flex',
    gap: '10px'
})
const Row = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    justifyItems: 'center',
    alignItems: 'center',
    padding: '20px 0',
    textTransform: 'uppercase',
    borderBottom: `solid 2px ${theme.palette.secondary.main}`

}))
const Calendar = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    justifyItems: 'center',
    alignItems: 'center',
    padding: '20px 0 0',
    textTransform: 'uppercase',
    flexGrow: '1'
}))
const Day = styled('div')(({ theme }) => ({
    width: '100%',
    border: `solid 1px ${theme.palette.secondary.main}`,
    height: '100%',
    position: 'relative',
    color: theme.palette.primary.contrastText
}))
const BeforeMonth = styled('p')(({ theme }) => ({
    position: 'absolute',
    right: 0,
    padding: '5px',
    color: theme.palette.primary.light
}))
const DuringMonth = styled('p')(({ theme }) => ({
    position: 'absolute',
    right: 0,
    padding: '5px',
    fontWeight: '600'
}))
const AfterMonth = styled('p')(({ theme }) => ({
    position: 'absolute',
    right: 0,
    padding: '5px',
    color: theme.palette.primary.light

}))
const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
})

function NewCalendar({ date, setDate }) {
    const theme = useTheme();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const [month, setMonth] = useState(monthNames[date.getMonth()])
    const [monthNumber, setMonthNumber] = useState(date.getMonth())
    const [year, setYear] = useState(date.getFullYear())
    const [day, setDay] = useState(date.getDate())
    const [view, setView] = useState('monthly')
    const [firstDay, setFirstDay] = useState(new Date(date.getFullYear(), date.getMonth(), 1))
    const [lastDay, setLastDay] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    const [numDays, setNumDays] = useState(lastDay.getDate())
    const [beforeDays, setBeforeDays] = useState(firstDay.getDay())
    const [prevMonthlast, setPrevMonthLast] = useState(new Date(date.getFullYear(), date.getMonth(), 0))
    const [afterDays, setAfterDays] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay())
    const [reminders, setReminders] = useState([]);
    const [selectedReminderId, setSelectedReminderId] = useState(null);


    const changeView = (newView) => {
        setView(newView)
    }

    useEffect(() => {
        setMonth(monthNames[date.getMonth()])
        setMonthNumber(date.getMonth())
        setYear(date.getFullYear())
        setDay(date.getDate())
        setFirstDay(new Date(date.getFullYear(), date.getMonth(), 1))
        setLastDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
        setNumDays(lastDay.getDate())
        setBeforeDays(firstDay.getDay())
        setPrevMonthLast(new Date(date.getFullYear(), date.getMonth(), 0).getDate())
        setAfterDays(new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay())
    }, [date, monthNumber])

    useEffect(() => {
        // This effect fetches reminders from Firestore and updates the reminders state
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
    }, [date]);

    const today = () => {
        setDate(new Date())
    }

    const prev = () => {
        const newDate = new Date(date)
        newDate.setMonth(monthNumber - 1)
        setDate(newDate)
    }

    const next = () => {
        const newDate = new Date(date)
        newDate.setMonth(monthNumber + 1)
        setDate(newDate)
    }

    return (
        <Container>
            <Top>
                <Left>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button onClick={prev}>Prev</Button>
                        <Button onClick={next}>Next</Button>
                    </ButtonGroup>
                    <Button onClick={today}>Today</Button>
                </Left>
                <Typography variant='h4'>
                    {month.toUpperCase()} {year}
                </Typography>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button disabled={view === 'monthly'} onClick={() => changeView('monthly')}>Monthly</Button>
                    <Button disabled={view === 'weekly'} onClick={() => changeView('weekly')}>Weekly</Button>
                    <Button disabled={view === 'daily'} onClick={() => changeView('daily')}>Daily</Button>
                </ButtonGroup>
            </Top>
            <Row>
                {weekdays.map((weekday, i) => (
                    <Typography variant='h6' key={i}>{weekday}</Typography>
                ))}
            </Row>
            <Calendar>
                {/* Days from the previous month */}
                {Array.from({ length: beforeDays }).map((__, i) => (
                    <Day key={i + 1}>
                        <BeforeMonth>{prevMonthlast - beforeDays + i + 1}</BeforeMonth>
                    </Day>
                ))}
                {/* Days of the current month */}
                {Array.from({ length: numDays }).map((__, i) => {
                    const reminderDay = i + 1;
                    const remindersForDay = reminders.filter((reminder) => {
                        const reminderTime = new Date(reminder.time.toDate());
                        const isSameDay =
                            reminderTime.getUTCFullYear() === year &&
                            reminderTime.getUTCMonth() === monthNumber &&
                            reminderTime.getUTCDate() === reminderDay;

                        return isSameDay;
                    });

                    return (
                        <Day
                            key={i + 1}
                            style={{
                                background: i + 1 === day ? theme.palette.secondary.contrastText : 'transparent',
                            }}
                        >
                            <DuringMonth>{i + 1}</DuringMonth>
                            {remindersForDay.map((reminder) => (
                                <div key={reminder.id}>
                                    <div>{reminder.title}</div>
                                    <div>{reminder.description}</div> {/* Added line to display the description */}
                                </div>
                            ))}
                        </Day>
                    );
                })}
                {/* Days from the next month */}
                {Array.from({ length: afterDays === 0 ? 0 : 7 - afterDays }).map((__, i) => (
                    <Day key={i + 1}>
                        <AfterMonth>{i + 1}</AfterMonth>
                    </Day>
                ))}
            </Calendar>
        </Container>
    );
}

export default NewCalendar