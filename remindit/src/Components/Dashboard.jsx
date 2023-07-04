import Header from './Utility/Header'
import { Box, FormLabel, Input, Modal, OutlinedInput, Typography, styled } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import CustomCalendar from './Utility/CustomCalendar';
import EventFilter from './Utility/EventFilter';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!
import NewCalendar from './Utility/NewCalendar';
import { FcAbout, FcContacts, FcFeedback, FcPlus } from 'react-icons/fc';
import { BsMailbox, BsPlus } from 'react-icons/bs';
import ProfileIcon from './Utility/ProfileIcon';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import CustomButton from './Utility/CustomButton';
import { auth, firestore, storage } from "../firebase";
import { collection, doc, addDoc, getDocs, setDoc, updateDoc, query, where, Timestamp, getDoc } from "firebase/firestore";
import CreateEvent from './Utility/CreateEvent';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';


const TopCorner = styled('div')({
    position: 'absolute',
    top: '0',
    right: '0',  // Updated from 'left' to 'right'
    width: '200px',
    padding: '20px'
});

const Page = styled('div')({
    padding: '20px',
    paddingBottom: '0',
    width: '100%',
    height: '100%',
    overflow: 'auto', // Enable scrolling
});

const Main = styled('div')({
    display: 'flex',
    height: '90vh',
    gap: '20px'
})
const Left = styled('div')(({ theme }) => ({
    width: '25%',
    maxWidth: '500px',
    minWidth: '350px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'top',
    gap: '50px',
    alignItems: 'center',
    paddingTop: '40px',
}))
const Right = styled('div')(({ theme }) => ({
    marginTop: '40px',
    padding: '20px',
    flexGrow: '1',
    height: '100%',
    borderRadius: '16px',
    background: theme.palette.primary.border,
    position: 'relative',

}))

const BottomRight = styled('div')(({ theme }) => ({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    right: '5px',
    bottom: '5px',
    height: '60px',
    width: '60px',
    background: theme.palette.primary.main,
    transition: 'all .3s ease',
    borderRadius: '50%',
    fontSize: '50px',
    '&:hover': {
        height: '80px',
        width: '80px',
        cursor: 'pointer',
    }
}))

const BottomSection = styled('div')(({ theme }) => ({
    padding: '20px',
    background: theme.palette.primary.border,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '14px'
}));
const StyledLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '15px', color: 'white',
    textDecoration: 'none',
    '& :hover': {
        textDecoration: 'underline',
    }

}))




function Dashboard() {


    const [value, onChange] = useState(new Date());
    const [view, setView] = useState({ view: 'monthly', day: '2023-06-13' })
    const [selectedCategory, setSelectedCategory] = useState('');
    const [reminders, setReminders] = useState([]);
    const { user } = useContext(UserContext)
    const [inbox, setInbox] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [categories, setCategories] = useState(null)


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const fetchReminders = async () => {
        setTimeout(async () => {

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

            } catch (error) {
                console.error('Error fetching reminders:', error);
            }
        }, 400)
    };
    const getCategories = async (setCategories) => {
        const categoryDocRef = doc(firestore, 'categories', user.currentUser.uid);
        const docSnap = await getDoc(categoryDocRef)
        if (docSnap.exists()) {
            setSelectedCategories(docSnap.data().categories.filter(c => c.active))
            setCategories(docSnap.data().categories)
        } else {
            console.log('NOT FOUND')
        }
    }

    const changeView = (e) => {
        setView({ view: e.target.value.view, day: e.target.value.day })
    }
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };


    // Add an inbox notification when a reminder is due
    useEffect(() => {
        const currentDate = new Date();

        // Filter reminders that are due today or in the future
        const upcomingReminders = reminders.filter(
            (reminder) => reminder.date.toDate() >= currentDate
        );

        // Sort reminders by date in ascending order
        upcomingReminders.sort((a, b) => a.date.toDate() - b.date.toDate());

        // Get the first 5 reminders from the upcoming reminders
        const inboxNotifications = upcomingReminders.slice(0, 5);
        console.log(inboxNotifications)


        setInbox(inboxNotifications);

    }, [reminders, selectedCategories]);


    return (
        <Page>
            <Header />
            <Main>
                <Left>
                    <CustomCalendar onChange={onChange} value={value} reminders={reminders} />
                    <EventFilter selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} getCategories={getCategories} categories={categories} setCategories={setCategories} />
                    <BottomSection>
                        <div>
                            <Typography variant="h6">Have any Questions?</Typography>
                            <hr />
                        </div>
                        <Box>
                            <StyledLink to="/About" style={{}}>
                                <Typography variant="body1">About Us</Typography>
                                <FcAbout />
                            </StyledLink>
                            <StyledLink to="/contact" style={{}}>
                                <Typography variant="body1">Contact Us</Typography>
                                <FcFeedback />
                            </StyledLink>
                        </Box>
                        <Typography variant="body1">@remindit 2023</Typography>
                    </BottomSection>
                </Left>
                <Right>
                    <NewCalendar date={value} setDate={onChange} reminders={reminders} fetchReminders={fetchReminders} setReminders={setReminders} categories={categories} selectedCategories={selectedCategories} view={view} />
                    <BottomRight onClick={() => setOpen(true)}>
                        <BsPlus color={'white'} />
                    </BottomRight>
                    <CreateEvent open={open} handleClose={handleClose} fetchReminders={fetchReminders} categories={categories} getCategories={getCategories} setCategories={setCategories} />
                </Right>
            </Main>
        </Page>
    );
}

export default Dashboard