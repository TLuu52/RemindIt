import Header from './Utility/Header'
import { Box, FormLabel, Input, Modal, OutlinedInput, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import CustomCalendar from './Utility/CustomCalendar';
import EventFilter from './Utility/EventFilter';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!
import NewCalendar from './Utility/NewCalendar';
import { FcPlus } from 'react-icons/fc';
import { BsPlus } from 'react-icons/bs';
import ProfileIcon from './Utility/ProfileIcon';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import CustomButton from './Utility/CustomButton';
import { auth, firestore, storage } from "../firebase";
import { collection, doc, addDoc, getDocs, setDoc, updateDoc, query, where } from "firebase/firestore";
import CreateEvent from './Utility/CreateEvent';
import { Link } from 'react-router-dom';


const TopCorner = styled('div')({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '200px',
    padding: '20px'
})
const Page = styled('div')({
    padding: '20px',
    width: '100%',
    height: '100%',
    overflow: 'auto', // Enable scrolling
});

const Main = styled('div')({
    display: 'flex',
    height: '100%',
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
    height: '90%',
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
    marginTop: '40px',
    padding: '20px',
    background: theme.palette.primary.border,
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));


function Dashboard() {


    const [reminders, setReminders] = useState([]);
    const [value, onChange] = useState(new Date());
    const [view, setView] = useState({ view: 'dayGridMonth', day: '2023-06-13' })
    const [selectedCategory, setSelectedCategory] = useState('');

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const changeView = (e) => {
        setView({ view: e.target.value.view, day: e.target.value.day })
    }
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <Page>
            <Header />
            <Main>
                <Left>
                    <CustomCalendar onChange={onChange} value={value} reminders={reminders} />
                    <EventFilter />
                </Left>
                <Right>
                    <NewCalendar date={value} setDate={onChange} reminders={reminders} />
                    <BottomRight onClick={() => setOpen(true)}>
                        <BsPlus color={'white'} />
                    </BottomRight>
                    <CreateEvent open={open} handleClose={handleClose} />
                </Right>
            </Main>
            <BottomSection>
                <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Typography variant="body1">
                        Email: <a href="mailto:reminditsup@gmail.com">reminditsup@gmail.com</a>
                    </Typography>
                    <Typography variant="h5">
                        <Link to="/About">About Us</Link>
                    </Typography>
                    <Typography variant="h5" sx={{ marginTop: '2px' }}>
                        <Link to="/contact">Contact Us</Link>
                    </Typography>
                </Box>
                <Typography variant="body1">@remindit 2023</Typography>
            </BottomSection>
        </Page>
    );
}

export default Dashboard