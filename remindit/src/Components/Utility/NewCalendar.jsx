import { ButtonGroup, Button, Typography, styled, useTheme, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Box, Modal, TextareaAutosize, OutlinedInput, Input } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, Timestamp, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, firestore } from "../../firebase";
import CustomButton from './CustomButton';
import { BsClipboard, BsClipboard2, BsLink, BsPencil, BsPencilFill, BsPencilSquare, BsUpload } from 'react-icons/bs';
import ProfileIcon from './ProfileIcon';
import { FcEditImage } from 'react-icons/fc';


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
    top: 0,
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

// Create a new component for the filter section
function FilterSectionComponent({ keyword, selectedCategory, handleKeywordChange, handleCategoryChange, handleFilterSubmit }) {
    return (
        <div>
            <FilterLabel>Keyword:</FilterLabel>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FilterInput
                    type="text"
                    placeholder="Enter keyword"
                    value={keyword}
                    onChange={handleKeywordChange}
                    style={{ flex: 1, marginRight: '8px' }}
                />
                <FilterButton onClick={handleFilterSubmit}>Apply Filter</FilterButton>
            </div>
            <FilterLabel>Category:</FilterLabel>
            <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">All</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
            </select>
        </div>
    );
}

const CustomModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiBox-root': {
        background: theme.palette.primary.border,
        minWidth: '800px ',
        width: '1000px ',
        padding: '20px',
        borderRadius: '12px'
    },
    '& *': {
        fontFamily: 'Montserrat'
    },
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
    },
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

const PrioritySelect = styled(Select)(({ theme }) => ({
    color: '#fff',
    width: '120px',
    height: '40px',
    border: 'none',
    outline: 'none',
    fontWeight: '600',
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    }
}))

const DurationSelect = styled(Select)(({ theme }) => ({
    color: '#fff',
    width: '70px',
    height: '30px',
    border: 'none',
    outline: 'none',
    fontWeight: '400',
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    background: theme.palette.primary.light
}))

const Title = styled(Typography)({
    textTransform: 'uppercase'
})
const Comments = styled('div')(({ theme }) => ({
    flexGrow: '1'
}))
const CustomLabel = styled('label')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    '& input[type="file"]': {
        display: 'none'
    },
    '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
        opacity: .6,
        transition: 'all .3s ease'
    },
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.primary.light}`,
    gap: '10px',
    padding: '20px 20px',
    borderRadius: '8px',
    border: `none`,
}))

const Attachment = styled('div')(({ }) => ({
    background: '#333',
    padding: '8px',
    borderRadius: '6px',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5px'
}))

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
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [uploadedAttachment, setUploadedAttachment] = useState(null);
    const [notes, setNotes] = useState('');
    const [notesAttachments, setNotesAttachments] = useState([]);
    const [showFilter, setShowFilter] = useState(false); // State to manage filter section visibility
    const [searchTerm, setSearchTerm] = useState('');
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priority, setPriority] = useState('low');
    const [durationHours, setDurationHours] = useState('00')
    const [durationMin, setDurationMin] = useState('00')
    const [description, setDescription] = useState('')
    const [activity, setActivity] = useState('')
    const [title, setTitle] = useState('')
    const [attachments, setAttachments] = useState([])
    const [attachmentName, setAttachmentName] = useState('')
    const [attachmentURL, setAttachmentURL] = useState('')
    const [filteredReminders, setFilteredReminders] = useState([]); // Initialize an empty array for filtered reminders


    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSearch = () => {
        const foundReminder = reminders.find((reminder) => reminder.title === searchTerm);
        if (foundReminder) {
            setSelectedReminder(foundReminder);
            setShowPopup(true);
        }
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


    const closePopup = () => {
        setShowPopup(false);
    };


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

    useEffect(() => {
        // This effect fetches reminders from Firestore and updates the reminders state

        fetchReminders();
    }, [date, auth]);

    // Fetch the data from the "NotesAttachments" collection
    useEffect(() => {
        const fetchNotesAttachments = async () => {
            try {
                const notesattachmentsCollectionRef = collection(firestore, 'NotesAttachments');
                const notesattachmentsSnapshot = await getDocs(notesattachmentsCollectionRef);
                const notesattachmentsData = notesattachmentsSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                }));
                setNotesAttachments(notesattachmentsData.filter(notes => notes.userId === auth.currentUser.uid));
            } catch (error) {
                console.error('Error fetching notes and attachments: ', error);
            }
        };

        fetchNotesAttachments();
    }, [notes]);

    useEffect(() => {
        console.log(selectedReminder?.priority)
        setTimeout(() => {
            if (selectedReminder?.priority) {
                setPriority(selectedReminder.priority)
                setDurationHours(selectedReminder.duration.split(':')[0])
                setDurationMin(selectedReminder.duration.split(':')[1])
                setDescription(selectedReminder.description)
                setNotes(selectedReminder.notes)
                setAttachments(selectedReminder.attachments)
                setTitle(selectedReminder.title)
            }
        }, 400)
    }, [selectedReminder])


    const storage = getStorage(); // Initialize Firebase Storage

    const submit = async (e) => {
        e.preventDefault();

        try {
            // Get the current user ID
            const user = auth.currentUser;
            const userId = user.uid;

            // Upload the attachment file to Firebase Storage
            if (uploadedAttachment) {
                const storageRef = ref(storage, `attachments/${uploadedAttachment.name}`);
                const uploadTask = uploadBytesResumable(storageRef, uploadedAttachment);

                // Get the download URL of the uploaded file
                const downloadURL = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', null, reject, () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then(resolve)
                            .catch(reject);
                    });
                });
            }

            // // Create a new document in the "NotesAttachments" collection
            // const notesattachmentsCollectionRef = collection(firestore, 'NotesAttachments');
            // const newNotesAttachmentsDocRef = await addDoc(notesattachmentsCollectionRef, {
            //     notes: notes,
            //     attachmentUrl: downloadURL,
            //     userId: userId,
            // });
            const totalDuration = `${durationHours}:${durationMin}`
            console.log(`
            ${priority}\n
            ${description}\n
            ${totalDuration}\n
            ${notes}\n
            ${activity}\n
            ${selectedReminder.docId}\n
            `)
            // const newCategory = { name: categoryName, color: color };
            // const updatedCategories = categories ? [...categories, newCategory] : [newCategory];
            // setCategories(updatedCategories);
            console.log(attachments)
            const newAttachment = { name: attachmentName, attachmentURL }
            const updatedAttachments = attachments ? [...attachments, newAttachment] : [newAttachment]


            const reminderRef = doc(firestore, 'reminders', selectedReminder.docId);
            await updateDoc(reminderRef, {
                priority: priority,
                description: description || '',
                duration: totalDuration,
                notes: notes || '',
                activity: activity || '',
                title: title,
                attachments: updatedAttachments
                // NEED CATEGORY
            }).then(() => {
                fetchReminders()
            })
            closePopup();

            // console.log('Notes and Attachments saved successfully. Document ID:', newNotesAttachmentsDocRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const deleteNotesAttachment = async (id) => {
        try {
            // Delete the document from the "NotesAttachments" collection
            const notesattachmentsDocRef = doc(firestore, 'NotesAttachments', id);
            await deleteDoc(notesattachmentsDocRef);

            // Update the notesAttachments state by filtering out the deleted item
            setNotesAttachments((prevNotesAttachments) => prevNotesAttachments.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting notes and attachment: ', error);
        }
    };

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

    const getSelectBG = () => {
        switch (priority) {
            case 'low':
                return theme.palette.success.light
            case 'medium':
                return theme.palette.warning.light
            case 'high':
                return theme.palette.error.main
        }
    }

    const newAttachment = async (e) => {
        const file = e.target.files[0];

        try {
            // Create a storage reference with a unique filename
            const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${file.name}`);

            // Upload the file to the storage reference using the put method
            const snapshot = await uploadBytesResumable(storageRef, file);

            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('File uploaded successfully:', downloadURL);

            // Update the state with the new picture URL
            setAttachmentURL(downloadURL);
        } catch (error) {
            console.log('Error uploading file:', error);
        }
    };

    return (
        <Container>
            <SearchBar onClick={toggleFilter}>
                <SearchInput
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    list="suggestions"
                />
                <SearchButton onClick={handleSearch}>Search</SearchButton>
            </SearchBar>
            {showFilter && (
                <FilterSectionComponent
                    keyword={keyword}
                    selectedCategory={priority}
                    handleKeywordChange={handleKeywordChange}
                    handleCategoryChange={handleCategoryChange}
                    handleFilterSubmit={handleFilterSubmit}
                />
            )}
            <datalist id="suggestions">
                {reminders.map((reminder) => (
                    <option key={reminder.id} value={reminder.title} />
                ))}
            </datalist>
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
                    const remindersForDay = reminders
                        .filter((reminder) => {
                            const reminderTime = new Date(reminder.time.toDate());
                            const isSameDay =
                                reminderTime.getUTCFullYear() === year &&
                                reminderTime.getUTCMonth() === monthNumber &&
                                reminderTime.getUTCDate() === reminderDay;

                            return isSameDay;
                        })
                        .sort((a, b) => b.priority - a.priority);

                    const highestPriorityReminder = remindersForDay.length > 0 ? remindersForDay[0] : null;

                    const hasReminder = highestPriorityReminder !== null;
                    let progress = 0;

                    if (hasReminder) {
                        const currentDate = new Date();
                        const reminderDate = new Date(highestPriorityReminder.time.toDate());
                        const timeDiff = reminderDate.getTime() - currentDate.getTime();
                        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        progress = Math.max(0, Math.min(100, (7 - daysDiff) * 100 / 7));
                    }

                    return (
                        <Day
                            key={i + 1}
                            style={{
                                background: i + 1 === day ? theme.palette.secondary.contrastText : 'transparent',
                            }}
                        >
                            <button
                                onClick={() => {
                                    if (hasReminder) {
                                        setSelectedReminder(highestPriorityReminder);
                                        setShowPopup(true);
                                    }
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    width: '100%',
                                    height: '100%',
                                    padding: 0,
                                    margin: 0,
                                    cursor: hasReminder ? 'pointer' : 'default',
                                }}
                            >
                                <DuringMonth>{i + 1}</DuringMonth>
                                {hasReminder && (
                                    <>
                                        <div>Title: {highestPriorityReminder.title}</div>
                                        {/* Progress bar */}
                                        <LinearProgress variant="determinate" value={progress} />
                                    </>
                                )}
                            </button>
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

            <CustomModal open={showPopup} onClose={closePopup}>
                <Box>
                    {selectedReminder && (
                        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                            <Input placeholder={'Title'} value={title} onChange={(e) => setTitle(e.target.value)} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Title variant='h6' sx={{ fontSize: '16px' }}>Priority:</Title>
                                    <PrioritySelect value={priority} sx={{ background: getSelectBG() }} onChange={(e) => setPriority(e.target.value)}>
                                        <MenuItem value={'high'}>HIGH</MenuItem>
                                        <MenuItem value={'medium'}>MEDIUM</MenuItem>
                                        <MenuItem value={'low'}>LOW</MenuItem>
                                    </PrioritySelect>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Title variant='h6' sx={{ fontSize: '16px' }}>Duration:</Title>
                                    <DurationSelect value={durationHours} onChange={(e) => setDurationHours(e.target.value)}>
                                        <MenuItem value={'00'}>00</MenuItem>
                                        <MenuItem value={'01'}>01</MenuItem>
                                        <MenuItem value={'02'}>02</MenuItem>
                                        <MenuItem value={'03'}>03</MenuItem>
                                        <MenuItem value={'04'}>04</MenuItem>
                                        <MenuItem value={'05'}>05</MenuItem>
                                        <MenuItem value={'06'}>06</MenuItem>
                                        <MenuItem value={'07'}>07</MenuItem>
                                        <MenuItem value={'08'}>08</MenuItem>
                                        <MenuItem value={'09'}>09</MenuItem>
                                        <MenuItem value={'10'}>10</MenuItem>
                                        <MenuItem value={'11'}>11</MenuItem>
                                        <MenuItem value={'12'}>12</MenuItem>
                                    </DurationSelect>
                                    <Typography variant='body1'>Hour(s)</Typography>
                                    <DurationSelect value={durationMin} onChange={(e) => setDurationMin(e.target.value)}>
                                        <MenuItem value={'00'}>00</MenuItem>
                                        <MenuItem value={'15'}>15</MenuItem>
                                        <MenuItem value={'30'}>30</MenuItem>
                                        <MenuItem value={'45'}>45</MenuItem>
                                    </DurationSelect>
                                    <Typography variant='body1'>Minutes</Typography>
                                </div>
                            </div>
                            <div>
                                <Title>Description:</Title>
                                <StyledTextarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>


                            {/* <div style={{ color: 'white' }}>Activity: {selectedReminder.activity}</div>
                            <div>
                                <TextField
                                    label="Notes"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    InputLabelProps={{ style: { color: 'white' } }}
                                />
                            </div>
                            <div style={{ color: 'white' }}>
                                <label htmlFor="attachment-upload">Upload Attachment:</label>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    id="attachment-upload"
                                    accept=".pdf,.doc,.docx,.png,.jpg"
                                    onChange={(e) => setUploadedAttachment(e.target.files[0])}
                                />
                            </div>
                            {uploadedAttachment && (
                                <div>
                                    <Typography variant="subtitle1" style={{ color: 'white' }}>Saved Attachment:</Typography>
                                    <Typography style={{ color: 'white' }}>
                                        <a href={URL.createObjectURL(uploadedAttachment)} download={uploadedAttachment.name}>
                                            {uploadedAttachment.name}
                                        </a>
                                    </Typography>
                                </div>
                            )} */}


                            {/* Display notes and attachments */}
                            {/* {notesAttachments.map((item) => (
                                <div key={item.id}>
                                    <Typography variant="subtitle1" style={{ color: 'white' }}>Notes:</Typography>
                                    <Typography style={{ color: 'white' }}>{item.notes}</Typography>
                                    {item.attachmentUrl && (
                                        <div>
                                            <Typography variant="subtitle1" style={{ color: 'white' }}>Attachment:</Typography>
                                            <Typography style={{ color: 'white' }}>
                                                <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                                    {item.attachmentUrl}
                                                </a>
                                            </Typography>
                                        </div>
                                    )}
                                    <CustomButton onClick={() => deleteNotesAttachment(item.id)} text={'Delete'} size={'s'} color={2} />

                                </div>
                            ))}
                            <div>
                            </div> */}


                            {/* ***********CHANGE NOTES METHOD, ADD NOTES AND ATTACHMENTS TO REMINDERS COLLECTION********** */}
                            <div>
                                <Title>Attachments : &nbsp; <BsUpload /></Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '10px' }}>
                                    <Input placeholder='Attachment Name' sx={{ fontSize: '16px !important', width: 'auto !important' }} value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} />
                                    <CustomLabel>
                                        <input type="file" accept=".pdf,.doc,.docx, .png, .jpg, .jpeg, image/png, image/jpeg" onChange={newAttachment} />
                                        <BsUpload size={"20px"} />
                                    </CustomLabel>
                                </div>
                                {/* <Attachment > */}
                                {attachments && attachments.map(attachment => (
                                    <Attachment>
                                        <Typography variant='body1'>{attachment.name}</Typography>
                                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <BsPencilFill />
                                            <a style={{ cursor: 'pointer', color: 'inherit', display: 'grid', placeItems: 'center' }} onClick={() => navigator.clipboard.writeText(attachment.attachmentURL)}>
                                                <BsClipboard2 />
                                            </a>
                                            <a style={{ color: 'inherit', display: 'grid', placeItems: 'center' }} href={attachment.attachmentURL} target='_blank'>
                                                <BsLink />
                                            </a>
                                        </div>
                                    </Attachment>
                                ))}
                            </div>

                            <Title>Notes:</Title>
                            <StyledTextarea value={notes} onChange={e => setNotes(e.target.value)} />

                            <Title>Activity:</Title>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '10px' }}>
                                <ProfileIcon img='default' />
                                <OutlinedInput sx={{ color: '#fff', }} placeholder={'Write a comment...'} value={activity} onChange={(e) => setActivity(e.target.value)} />
                            </div>
                            <Comments />
                        </div>
                    )}
                    <CustomButton onClick={closePopup} text={'Close'} color={0} size={'s'} />
                    <CustomButton onClick={submit} text={'Submit'} color={1} size={'s'} />
                </Box>
            </CustomModal>
        </Container>

    );
}

export default NewCalendar