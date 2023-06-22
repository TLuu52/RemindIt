import Header from './Utility/Header'
import { Box, FormLabel, Input, Modal, OutlinedInput, Typography, styled } from '@mui/material'
import { useState } from 'react';
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
import { collection, doc, addDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";




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


    '& .fc.fc-media-screen.fc-direction-ltr.fc-theme-standard': {
        maxHeight: '100%',
        background: theme.palette.primary.border,
        borderRadius: '16px',

    },
    '& .fc-theme-standard th': {
        border: 'none'
    },
    '& .fc-theme-standard .fc-scrollgrid': {
        border: 'none'
    },
    '& .fc-dayGridMonth-view.fc-view.fc-daygrid *': {
        border: 'none'
    },
    '& .fc-dayGridMonth-view.fc-view.fc-daygrid table tbody tr td': {
        border: 'solid 1px #7a95a2'
    },
    '& .fc-toolbar-title, .fc-daygrid-day-number, .fc .fc-col-header-cell-cushion': {
        color: theme.palette.primary.contrastText
    },
    '& .fc-day.fc-day-today': {
        background: theme.palette.secondary.light
    },
    '& .fc-timegrid-divider.fc-cell-shaded': {
        border: 'none',
    },
    '& .fc-scrollgrid-section .fc-timegrid-divider ': {
        display: 'none'
    },
    '& .fc-theme-standard td, .fc-theme-standard th': {
        border: 'none'
    },
    '& .fc-timeGridWeek-view.fc-view.fc-timegrid .fc-scrollgrid-sync-table': {
        display: 'none'
    },
    '& .fc-col-header-cell': {
        padding: '10px 0px',
        border: `solid 1px ${theme.palette.secondary.main}`
    },
    '& .fc-timeGridWeek-view.fc-view.fc-timegrid .fc-scrollgrid tbody tr.fc-scrollgrid-section, .fc-timeGridDay-view.fc-view.fc-timegrid .fc-scrollgrid tbody tr.fc-scrollgrid-section': {
        display: 'none'
    },
    '& .fc-timeGridWeek-view.fc-view.fc-timegrid .fc-scrollgrid tbody tr.fc-scrollgrid-section-liquid, .fc-timeGridDay-view.fc-view.fc-timegrid .fc-scrollgrid tbody tr.fc-scrollgrid-section-liquid': {
        display: 'table-row'
    },
    '& .fc-scrollgrid-section-header th': {
        borderBottom: `solid 1px ${theme.palette.secondary.dark}`
    },
    '& .fc-timegrid-slot-label-cushion.fc-scrollgrid-shrink-cushion': {
        color: theme.palette.primary.contrastText
    },
    '& .fc-timegrid-slot.fc-timegrid-slot-minor': {
        borderBottom: `solid 1px ${theme.palette.secondary.dark}`
    }
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
const CustomModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiBox-root': {
        minHeight: '800px',
        minWidth: '1000px',
        display: 'flex',
        justifyContent: 'center',
        gap: '5px',
        background: theme.palette.primary.border,
        borderRadius: '8px',
        padding: '30px',
        '& .MuiInput-root': {
            color: theme.palette.primary.contrastText,
            width: '100%',
            padding: '0px 10px',
            fontSize: '30px'

        },
        '& .MuiOutlinedInput-root': {
            width: '100%',
            color: theme.palette.primary.contrastText,
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.secondary.border
        },
        '& .MuiInput-root:before': {
            borderColor: theme.palette.secondary.border
        }
    }
}))

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    color: theme.palette.primary.contrastText,
    minHeight: '100px !important',
    background: 'transparent',
    borderColor: theme.palette.secondary.border,
    borderRadius: '8px',
    outline: 'none',
    padding: '10px',
    '&:focus-visible': {
        border: `solid 1px ${theme.palette.primary.main}`
    }
}))
const ModalLeft = styled('div')(({ theme }) => ({
    width: "75%",
    paddingRight: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
}))
const ModalRight = styled('div')(({ theme }) => ({
    flexGrow: '1',
    display: 'flex'
}))
const Line = styled('div')(({ theme }) => ({
    height: "100%",
    width: '1px',
    background: theme.palette.secondary.border
}))
const Comments = styled('div')(({ theme }) => ({
    flexGrow: '1'
}))
const Flex = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '30px',
    gap: '20px'
}))


function TestDashboard() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('');
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

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleFilterSubmit = () => {
        // Perform filtering based on selected options
        // You can access the keyword, selectedDate, and selectedCategory here
        // Example:
        console.log('Keyword:', keyword);
        console.log('Selected Category:', selectedCategory);
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            // Add your Firestore integration logic here
            const docRef = await addDoc(collection(firestore, 'Reminders'), {
                title,
                description,
                activity,
            });

            // Check if the "reminders" collection exists, create it if it doesn't
            const remindersCollectionRef = collection(firestore, "reminders");
            const collectionSnapshot = await getDocs(remindersCollectionRef);
            if (collectionSnapshot.empty) {
                await setDoc(doc(firestore, "metadata", "remindersCollection"), {
                    exists: true,
                });
            }

            // Create a new document in the "reminders" collection with the reminder
            const userDocRef = doc(firestore, "reminders", auth.currentUser.uid);

            console.log('Document written with ID: ', docRef.id);

            await setDoc(userDocRef, {
                title: title,
                description: description,
                activity: activity
            });

            // Close the modal or perform any other necessary actions
            handleClose();
            console.log("Reminder saved successfully.");

        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };
    return (
        <Page>
            <Header />
            <Main>
                <Left>
                    <CustomCalendar onChange={onChange} value={value} />
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
                    <CustomModal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="CustomModal-modal-title"
                        aria-describedby="modal-modal-description" >
                        <Box>
                            <form onSubmit={(e) => submit(e)}>
                                <ModalLeft>
                                    <Input placeholder={'Title'} value={title} onChange={(e) => setTitle(e.target.value)} />
                                    <Typography variant='h4'>Description</Typography>
                                    <StyledTextarea placeholder={'Add a more detailed description...'} value={description} onChange={(e) => setDescription(e.target.value)} />
                                    <Typography variant='h4'>Activity</Typography>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <ProfileIcon img='default' />
                                        <OutlinedInput placeholder={'Write a comment...'} value={activity} onChange={(e) => setActivity(e.target.value)} />
                                    </div>
                                    <Comments />
                                </ModalLeft>
                                <ModalRight>
                                    <Line />
                                    <Flex>
                                        <div>
                                            <FormLabel>Date</FormLabel>
                                            <DatePicker />
                                        </div>
                                        <div>
                                            <FormLabel>Time</FormLabel>
                                            <TimePicker />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <CustomButton size={'s'} text={'Cancel'} onClick={handleClose} />
                                            <CustomButton size={'s'} text={'Create'} color={1} />
                                        </div>
                                    </Flex>
                                </ModalRight>
                            </form>
                        </Box>
                    </CustomModal>

                </Right>
            </Main>
        </Page >
    )
}

export default TestDashboard