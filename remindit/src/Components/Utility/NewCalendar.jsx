import { ButtonGroup, Button, Typography, styled, useTheme, LinearProgress, TextField, Select, MenuItem, Box, Modal, TextareaAutosize, OutlinedInput, Input, Popover } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { collection, getDocs, doc, deleteDoc, updateDoc, FieldValue } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, firestore } from "../../firebase";
import CustomButton from './CustomButton';
import { BsClipboard2, BsLink, BsPencilFill, BsUpload, BsTrashFill } from 'react-icons/bs';
import ProfileIcon from './ProfileIcon';


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
const CustomPopover = styled(Popover)(({ theme }) => ({
    '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper': {
        background: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText
    }
}))

function NewCalendar({ date, setDate, fetchReminders, reminders, setReminders }) {
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
    const [discussionDescription, setDiscussionDescription] = useState('');
    const [discussionThreads, setDiscussionThreads] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filterBy, setFilterBy] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [anchorEl, setAnchorEl] = useState(null)
    const [newAttachmentName, setNewAttachmentName] = useState('')
    const [newAttachmentURL, setNewAttachmentURL] = useState('')
    const [isComplete, setIsComplete] = useState(false);
    const openEditAttachment = Boolean(anchorEl)


    const closeEditAttachment = () => {
        setAnchorEl(null)
    }

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const toggleFilter = () => {
        setShowFilter(!showFilter); // Toggle filter section visibility
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
            let updatedAttachments = attachments || []; // Initialize with an empty array if attachments is undefined
            if (attachmentURL != '' && attachmentName != '') {
                const newAttachment = { name: attachmentName, attachmentURL }
                updatedAttachments = attachments ? [...attachments, newAttachment] : [newAttachment]
            }


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
                setAttachmentName('')
                setAttachmentURL('')
            })

            if (isComplete) {
                // Delete the reminder and mark it as completed
                await deleteDoc(reminderRef);
                setIsComplete(false);
            } else {
                // Update the reminder with the new data
                await updateDoc(reminderRef, {
                    priority: priority,
                    description: description || '',
                    duration: totalDuration,
                    notes: notes || '',
                    activity: activity || '',
                    title: title,
                    attachments: updatedAttachments
                    // NEED CATEGORY
                });
                // Perform any additional logic or UI updates for an updated reminder
            }

            closePopup();

            // console.log('Notes and Attachments saved successfully. Document ID:', newNotesAttachmentsDocRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const editAttachment = async (attachment) => {
        const newAttachments = attachments
        newAttachments.map(a => {
            if (a.attachmentURL === attachment.attachmentURL) {
                a.name = newAttachmentName;
                a.attachmentURL = newAttachmentURL
            }
        })
        try {
            // Update the document in the "reminders" collection
            const reminderDocRef = doc(firestore, 'reminders', selectedReminder.docId)
            await updateDoc(reminderDocRef, {
                attachments: newAttachments
            }).then(() => {
                setAttachments(newAttachments)
                fetchReminders()
                closeEditAttachment()
            })
        } catch (error) {
            console.error('Error editing attachment: ', error);
        }
    };

    const deleteAttachment = async (currentAttachment) => {
        console.log(currentAttachment)
        try {
            // Delete the attachment document from the "reminders" collection
            // Get all attachments, filter out the attachment that is selected, update doc with new attachments
            console.log("ALL ATTACHMENTS :", attachments)
            const newAttachments = attachments.filter(a => (a.name != currentAttachment.name && a.attachmentURL != currentAttachment.attachmentURL))
            console.log('UPDATED : ', newAttachments)

            const reminderDocRef = doc(firestore, 'reminders', selectedReminder.docId)
            await updateDoc(reminderDocRef, {
                attachments: newAttachments
            }).then(() => {
                setAttachments(newAttachments)
                fetchReminders()
            })
            // const attachmentDocRef = doc(firestore, 'reminders', id);
            // await deleteDoc(attachmentDocRef);

            // // Update the attachments state by filtering out the deleted item
            // setAttachments(prevAttachments => prevAttachments.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting attachment: ', error);
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

    const newEditAttachment = async (e) => {
        const file = e.target.files[0];

        try {
            // Create a storage reference with a unique filename
            const storageRef = ref(storage, `attachments/${auth.currentUser.uid}/${file.name}`);

            // Upload the file to the storage reference using the put method
            const snapshot = await uploadBytesResumable(storageRef, file);

            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('File uploaded successfully:', downloadURL);

            // Update the state with the new picture URL
            setNewAttachmentURL(downloadURL);
        } catch (error) {
            console.log('Error uploading file:', error);
        }
    }

    const newAttachment = async (e) => {
        const file = e.target.files[0];

        try {
            // Create a storage reference with a unique filename
            const storageRef = ref(storage, `attachments/${auth.currentUser.uid}/${file.name}`);

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

    const handleSaveDiscussion = () => {
        const newDiscussionThread = {
            activity: activity,
            description: discussionDescription,
        };

        const updatedThreads = [...discussionThreads, newDiscussionThread];

        // Save the updated threads in localStorage
        localStorage.setItem('discussionThreads', JSON.stringify(updatedThreads));

        // Clear the input fields
        setActivity('');
        setDiscussionDescription('');
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            const foundReminders = reminders.filter(
                (reminder) => reminder.title.includes(searchTerm)
            );
            setSearchResults(foundReminders);
            setShowModal(true); // Open the modal when search term is not empty
        }
    };

    // Event handler for filter selection change
    const handleFilterChange = (e) => {
        const selectedFilterBy = e.target.value;
        setFilterBy(selectedFilterBy);

        let filteredReminders = [];

        if (selectedFilterBy === "priority") {
            // Filter by priority
            filteredReminders = reminders.filter((reminder) => reminder.priority === selectedPriority);
        } else if (selectedFilterBy === "duration") {
            // Filter by duration
            filteredReminders = reminders.filter((reminder) => reminder.duration === selectedDuration);
        } else {
            // No specific filter, show all reminders
            filteredReminders = reminders;
        }

        setSearchResults(filteredReminders);
    };

    // Event handler for sort selection change
    const handleSortChange = (e) => {
        const selectedSortBy = e.target.value;
        setSortBy(selectedSortBy);

        // Create a copy of the searchResults array to avoid directly modifying the state
        const sortedResults = [...searchResults];

        if (selectedSortBy === "title") {
            // Sort by title
            sortedResults.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSortBy === "priority") {
            // Sort by priority
            sortedResults.sort((a, b) => a.priority - b.priority);
        } else if (selectedSortBy === "duration") {
            // Sort by duration
            sortedResults.sort((a, b) => {
                const durationA = a.duration.split(":");
                const durationB = b.duration.split(":");
                return durationA[0] - durationB[0] || durationA[1] - durationB[1];
            });
        }

        setSearchResults(sortedResults);
    };

    return (
        <Container>
            <div>
                {/* Search bar and input */}
                <SearchBar onClick={toggleFilter}>
                    <SearchInput
                        type="text"
                        placeholder="Search by Title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        list="suggestions"
                    />
                    <SearchButton onClick={handleSearch}>Search</SearchButton>
                </SearchBar>

                {/* Suggestions list */}
                <datalist id="suggestions">
                    {reminders.map((reminder) => (
                        <option key={reminder.id} value={reminder.title} />
                    ))}
                </datalist>

                {/* Modal */}
                {showModal && (
                    <CustomModal open={showModal} onClose={closeModal}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                            <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                                <h2 style={{ marginTop: 0, fontSize: '45px' }}>Search Results</h2>
                                {/* Filter By */}
                                <div className="filter-by">
                                    <label htmlFor="filter-select">Filter By:</label>
                                    <select id="filter-select" value={filterBy} onChange={handleFilterChange}>
                                        <option value="">All</option>
                                        <option value="priority">Priority</option>
                                        <option value="duration">Duration</option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div className="sort-by">
                                    <label htmlFor="sort-select">Sort By:</label>
                                    <select id="sort-select" value={sortBy} onChange={handleSortChange}>
                                        <option value="title">Title</option>
                                        <option value="priority">Priority</option>
                                        <option value="duration">Duration</option>
                                    </select>
                                </div>

                                {/* Search Results */}
                                <div className="result-box">
                                    {searchResults.length > 0 ? (
                                        <ul>
                                            {searchResults.map((reminder) => (
                                                <li key={reminder.id}>
                                                    <a href={`${reminder.id}`}>
                                                        {reminder.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No reminders found.</p>
                                    )}
                                </div>
                            </div>
                        </Box>
                    </CustomModal>
                )}
            </div>
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

                    const reminderCount = remindersForDay.length;

                    const highestPriorityReminder = reminderCount > 0 ? remindersForDay[0] : null;

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
                                {reminderCount > 0 && <div>Reminder Count: {reminderCount}</div>}
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
                <Box style={{ maxHeight: '80vh', overflow: 'auto' }}>
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="checkbox" checked={isComplete} onChange={(e) => setIsComplete(e.target.checked)} />
                                    <Typography variant="body1">Mark as complete</Typography>
                                </div>
                            </div>
                            <div>
                                <Title>Description:</Title>
                                <StyledTextarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>


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
                                    <Attachment key={attachment.id}>
                                        <Typography variant='body1'>{attachment.name}</Typography>
                                        <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <BsPencilFill style={{ cursor: 'pointer' }} onClick={(e) => setAnchorEl(e.currentTarget)} />
                                            <CustomPopover
                                                open={openEditAttachment}
                                                anchorEl={anchorEl}
                                                onClose={closeEditAttachment}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left'
                                                }}

                                            >
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px' }}>
                                                        <Input
                                                            placeholder='Attachment Name'
                                                            sx={{
                                                                fontSize: '16px !important',
                                                                width: 'auto !important',
                                                                color: theme.palette.primary.contrastText
                                                            }}
                                                            value={newAttachmentName}
                                                            onChange={(e) => setNewAttachmentName(e.target.value)}
                                                        />
                                                        <CustomLabel>
                                                            <input type="file" accept=".pdf,.doc,.docx, .png, .jpg, .jpeg, image/png, image/jpeg" onChange={newEditAttachment} />
                                                            <BsUpload size={"20px"} />
                                                        </CustomLabel>
                                                    </div>
                                                    <div style={{ padding: '0px 10px 10px', display: 'flex', gap: '10px' }}>
                                                        <CustomButton size={'s'} color={0} text='Cancel' onClick={closeEditAttachment} />
                                                        <CustomButton size={'s'} color={1} text='Save' onClick={() => editAttachment(attachment)} />
                                                    </div>
                                                </>
                                            </CustomPopover>
                                            <BsTrashFill style={{ cursor: 'pointer' }} onClick={() => deleteAttachment(attachment)} />
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
                                <OutlinedInput sx={{ color: '#fff' }} placeholder="Write a comment..." value={activity} onChange={(e) => setActivity(e.target.value)} />
                            </div>
                            {activity && (
                                <div>
                                    <div>
                                        <Title variant="h6">Description:</Title>
                                        <TextField
                                            sx={{ color: '#fff' }}
                                            multiline
                                            rows={4}
                                            placeholder="Enter a description..."
                                            value={discussionDescription}
                                            onChange={(e) => setDiscussionDescription(e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </div>
                                    <Button variant="contained" color="primary" onClick={handleSaveDiscussion}>Save</Button>
                                    <Comments activity={activity} />
                                </div>
                            )}
                            <div>
                                <Title>Discussion Threads:</Title>
                                {discussionThreads.map((thread, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <ProfileIcon img='default' />
                                        <div>
                                            <Typography variant="h6">Activity: {thread.activity}</Typography>
                                            <Typography variant="body1">Description: {thread.description}</Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
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