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
    height: '100%'
})
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

const SearchBar = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center horizontally
    marginBottom: '20px',
    textAlign: 'center', // Center text within input
}));
const SearchInput = styled('input')(({ theme }) => ({
    width: '300px',
    padding: '8px',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.primary.main}`,
    marginRight: '10px',
}));

const SearchButton = styled('button')(({ theme }) => ({
    padding: '8px 16px',
    borderRadius: '4px',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: 'none',
    cursor: 'pointer',
}));

const FilterSection = styled('div')(({ theme }) => ({
    padding: '10px',
    background: theme.palette.primary.border,
    borderRadius: '4px',
    color: theme.palette.primary.contrastText,
}));

const FilterLabel = styled('label')({
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
});

const FilterInput = styled('input')({
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    marginBottom: '10px',
});

const FilterButton = styled('button')(({ theme }) => ({
    padding: '8px 16px',
    borderRadius: '4px',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: 'none',
    cursor: 'pointer',
}));
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



function Dashboard() {


    const [reminders, setReminders] = useState([]);
    const [value, onChange] = useState(new Date());
    const [view, setView] = useState({ view: 'dayGridMonth', day: '2023-06-13' })
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false); // State to manage filter section visibility
    const [keyword, setKeyword] = useState('');
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

    const handleSearch = () => {
        // Handle the search functionality here
        console.log('Search term:', searchTerm);
    };

    const toggleFilter = () => {
        setShowFilter(!showFilter); // Toggle filter section visibility
    };

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };



    const handleFilterSubmit = () => {
        // Perform filtering based on selected options
        // You can access the keyword, selectedDate, and selectedCategory here
        // Example:
        console.log('Keyword:', keyword);
        console.log('Selected Category:', selectedCategory);
    };

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                // Check if a user is logged in
                if (auth.currentUser) {
                    const remindersCollectionRef = collection(firestore, 'reminders');
                    const remindersQuery = query(
                        remindersCollectionRef,
                        where('userId', '==', auth.currentUser.uid)
                    );
                    const querySnapshot = await getDocs(remindersQuery);

                    const fetchedReminders = [];
                    querySnapshot.forEach((doc) => {
                        const reminder = doc.data();
                        fetchedReminders.push(reminder);
                    });

                    setReminders(fetchedReminders);
                }
            } catch (error) {
                console.error('Error fetching reminders: ', error);
            }
        };

        fetchReminders();
    }, []);


    return (
        <Page>
            <Header />
            <Main>
                <Left>
                    <CustomCalendar onChange={onChange} value={value} reminders={reminders} /> {/* Pass reminders as prop */}
                    <EventFilter />
                </Left>
                <Right>
                    <SearchBar onClick={toggleFilter}>
                        <SearchInput type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <SearchButton onClick={handleSearch}>Search</SearchButton>
                        {showFilter && (
                            <FilterSection>
                                <FilterLabel>Keyword:</FilterLabel>
                                <FilterInput
                                    type="text"
                                    placeholder="Enter keyword"
                                    value={keyword}
                                    onChange={handleKeywordChange}
                                />
                                <FilterLabel>Category:</FilterLabel>
                                <select value={selectedCategory} onChange={handleCategoryChange}>
                                    <option value="">All</option>
                                    <option value="category1">Category 1</option>
                                    <option value="category2">Category 2</option>
                                    <option value="category3">Category 3</option>
                                </select>
                                <FilterButton onClick={handleFilterSubmit}>Apply Filter</FilterButton>
                            </FilterSection>
                        )}
                    </SearchBar>
                    <NewCalendar date={value} setDate={onChange} />
                    <BottomRight onClick={() => setOpen(true)}>
                        <BsPlus color={'white'} />
                    </BottomRight>
                    <CreateEvent open={open} handleClose={handleClose} />
                </Right>
            </Main>
        </Page >
    )
}

export default Dashboard