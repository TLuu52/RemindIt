import { ButtonGroup, Button, Typography, styled, useTheme, LinearProgress, TextField, Select, MenuItem, Box, Modal, TextareaAutosize, OutlinedInput, Input, Popover, Autocomplete, Popper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { collection, getDocs, doc, deleteDoc, updateDoc, Timestamp, getDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, firestore } from "../../firebase";
import CustomButton from './CustomButton';
import { BsClipboard2, BsLink, BsPencilFill, BsUpload, BsTrashFill, BsCircleFill, BsSend } from 'react-icons/bs';
import ProfileIcon from './ProfileIcon';
import AllReminders from './AllReminders';
import { ArrowRightIcon } from '@mui/x-date-pickers';
import { UserContext } from '../../App';



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
const DailyRow = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
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
const DailyCalendar = styled('div')(({ theme }) => ({
    padding: '20px 0 0',
    textTransform: 'uppercase',
    flexGrow: '1',
    position: 'relative'
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
    top: 0,
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
    top: 0,
    right: 0,
    padding: '5px',
    color: theme.palette.primary.light

}))
const Container = styled('div')({
    display: 'grid',
    gridTemplateRows: 'auto auto auto 10fr',
    position: 'relative',
    height: '100%'
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
const CategorySelect = styled(Select)(({ theme }) => ({
    color: '#fff',
    width: '300px !important',
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
    gap: '10px',
    padding: '20px 20px',
    borderRadius: '8px',
    border: `none`,
}))
const Attachment = styled('div')(({
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

const Reminder = styled('div')({
    padding: '5px',
    textAlign: 'left'
})

const WeeklyDay = styled('div')(({ theme }) => ({
    width: '100%',
    border: `solid 1px ${theme.palette.secondary.main}`,
    height: '100%',
    position: 'relative',
    color: theme.palette.primary.contrastText,
    paddingTop: '50px'
}))
const DailyDay = styled('div')(({ theme }) => ({
    display: 'grid',
    height: '900px',
    gridTemplateRows: 'repeat(12, 1fr)',
    width: '100%',
    border: `solid 1px ${theme.palette.secondary.main}`,
    maxHeight: '900px',
    position: 'relative',
    color: theme.palette.primary.contrastText,
    paddingTop: '50px',
    overflow: 'auto'
}))
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedEnd.MuiAutocomplete-input.MuiAutocomplete-inputFocused': {
        width: '100%'
    }
}))
const StyledAutoCompleteDiv = styled('div')(({ theme }) => ({
    color: "#222 !important",
    '& .MuiAutocomplete-popper.MuiAutocomplete-popperDisablePortal.MuiPopper-root': {
        color: "#222 !important"
    },
    '& .MuiAutocomplete-listbox ': {
        background: '#333'
    }
}))
const Comment = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'auto 16fr auto',
    width: '100%',
    gridColumnGap: '10px',
    paddingBottom: '10px'
})

function NewCalendar({ date, setDate, fetchReminders, reminders, setReminders, categories, setCategories, selectedCategories }) {
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
    const [sortBy, setSortBy] = useState('title');
    const [searchResults, setSearchResults] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null)
    const [newAttachmentName, setNewAttachmentName] = useState('')
    const [newAttachmentURL, setNewAttachmentURL] = useState('')
    const [isComplete, setIsComplete] = useState(false);
    const [category, setCategory] = useState({
        name: '',
        color: 'transparent',
    })
    const [allRemindersOpen, setAllRemindersOpen] = useState(false)
    const [dayReminders, setDayReminders] = useState([])
    const [reminderDay, setReminderDay] = useState('')
    const openEditAttachment = Boolean(anchorEl)
    const [dependency, setDependency] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedActivity, setEditedActivity] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editThread, setEditThread] = useState(null);
    const [changeDep, setChangeDep] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [dependencyValue, setDependencyValue] = useState('None')
    const [comment, setComment] = useState('')
    const { setOpen, setMessage } = useContext(UserContext)

    const closeEditAttachment = () => {
        setAnchorEl(null)
    }
    const getNewVal = (newVal) => {
        if (newVal === null) {
            return
        }
        if (newVal != 'None') {
            setDependencyValue(reminders.filter(r => r.title === newVal)[0].title)
            setDependency(reminders.filter(r => r.title === newVal)[0])
        } else {
            setDependencyValue('None')
            setDependency('')
        }
    }

    const toggleFilter = () => {
        setShowFilter(!showFilter); // Toggle filter section visibility
    };

    const closePopup = () => {
        setShowPopup(false);
        setChangeDep(false)
    };

    const changeView = (newView) => {
        setView(newView)
    }

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

        resetAct()
    }, [date, auth]);

    const resetAct = async () => {
        const q = query(collection(firestore, 'reminders'), where('activity', '==', ''));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docu) => {
            const docRef = doc(firestore, 'reminders', docu.data().docId)
            await updateDoc(docRef, {
                activity: []
            })
        })

    }

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
    const getReminderByID = async (docId) => {
        if (docId === '') {
            return
        }
        const docRef = doc(firestore, 'reminders', docId)
        const docSnap = await getDoc(docRef)

        return docSnap.data()
    }

    useEffect(() => {
        setTimeout(async () => {
            if (selectedReminder?.priority) {
                const dep = await getReminderByID(selectedReminder.dependency)
                setPriority(selectedReminder.priority)
                setDurationHours(selectedReminder.duration.split(':')[0])
                setDurationMin(selectedReminder.duration.split(':')[1])
                setDescription(selectedReminder.description)
                setNotes(selectedReminder.notes)
                setAttachments(selectedReminder.attachments)
                setTitle(selectedReminder.title)
                setCategory(selectedReminder.category)
                setActivity(selectedReminder.activity.sort((a, b) => { return b.time.toDate() - a.time.toDate() }))
                setDependency(dep)
                setDependencyValue(dep ? dep.title : '')
            }
        }, 400)
    }, [selectedReminder])

    const storage = getStorage(); // Initialize Firebase Storage

    const handleSaveDiscussion = async () => {
        const newActivity = {
            comment: comment,
            userId: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL,
            email: auth.currentUser.email,
            time: new Date()
        };
        const currentActivity = [...activity, newActivity]
        const reminderRef = doc(firestore, 'reminders', selectedReminder.docId);
        await updateDoc(reminderRef, {
            activity: currentActivity
        }).then(() => {

        })

        // Clear the discussion input fields
        setActivity(currentActivity);
        setDiscussionDescription('');
    };

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

            const totalDuration = `${durationHours}:${durationMin}`
            let updatedAttachments = attachments || []; // Initialize with an empty array if attachments is undefined
            if (attachmentURL != '' && attachmentName != '') {
                const newAttachment = { name: attachmentName, attachmentURL }
                updatedAttachments = attachments ? [...attachments, newAttachment] : [newAttachment]
            }

            const reminderRef = doc(firestore, 'reminders', selectedReminder.docId);

            const reminderDoc = await getDoc(reminderRef);


            await updateDoc(reminderRef, {
                priority: priority,
                description: description || '',
                duration: totalDuration,
                notes: notes || '',
                title: title,
                attachments: updatedAttachments,
                category: category,
                dependency: dependency?.docId || '',
            }).then(() => {
                fetchReminders()
                setAttachmentName('')
                setAttachmentURL('')
                setMessage({ text: 'Reminder updated!', severity: 'success' })
                setOpen(true)
            }).catch(() => {
                setMessage({ text: 'Error updating reminder!', severity: 'Error' })
                setOpen(true)
            });;

            if (isComplete) {
                // Delete the reminder and mark it as completed
                await deleteDoc(reminderRef);
                fetchReminders()
                setIsComplete(false);
            } else {
                // Update the reminder with the new data
                await updateDoc(reminderRef, {
                    priority: priority,
                    description: description || '',
                    duration: totalDuration,
                    notes: notes || '',
                    title: title,
                    attachments: updatedAttachments,
                    category: category,
                }).then(() => {
                    setMessage({ text: 'Reminder updated!', severity: 'success' })
                    setOpen(true)
                }).catch(() => {
                    setMessage({ text: 'Error updated reminder!', severity: 'Error' })
                    setOpen(true)
                });;
                // Perform any additional logic or UI updates for an updated reminder
            }

            closePopup();


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
        try {
            // Delete the attachment document from the "reminders" collection
            // Get all attachments, filter out the attachment that is selected, update doc with new attachments
            const newAttachments = attachments.filter(a => (a.name != currentAttachment.name && a.attachmentURL != currentAttachment.attachmentURL))

            const reminderDocRef = doc(firestore, 'reminders', selectedReminder.docId)
            await updateDoc(reminderDocRef, {
                attachments: newAttachments
            }).then(() => {
                setAttachments(newAttachments)
                fetchReminders()
            })
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

    const getCategoryBG = () => {
        return category?.color || 'transparent'
    }
    const changeCategory = (e) => {
        const cat = categories.filter(c => c.name === e)[0]
        setCategory(cat)
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

    const closeModal = () => {
        setSelectedReminder(null)
        setShowModal(false);
        fetchReminders();
    };
    const filterReminders = () => {
        let uniqueNames = [];
        reminders.forEach(r => {
            if (r.docId === selectedReminder.docId) return
            if (!uniqueNames.includes(r.title)) {
                uniqueNames.push(r.title)
            }
        })
        return uniqueNames
    }

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            const foundReminders = reminders.filter(
                (reminder) => reminder.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(foundReminders);
            setShowModal(true); // Open the modal when search term is not empty
        }
    };

    // Event handler for sort selection change
    const handleSortChange = (e) => {
        const selectedSortBy = e.target.value;
        setSortBy(selectedSortBy);

        // Define the priority order
        const priorityOrder = {
            high: 3,
            medium: 2,
            low: 1
        };

        // Create a copy of the searchResults array to avoid directly modifying the state
        const sortedResults = [...searchResults];

        if (selectedSortBy === "title") {
            // Sort by title
            sortedResults.sort((a, b) => a.title.localeCompare(b.title));
        } else if (selectedSortBy === "priority") {
            // Sort by priority (from high to low)
            sortedResults.sort((a, b) => {
                const priorityA = priorityOrder[a.priority.toLowerCase()];
                const priorityB = priorityOrder[b.priority.toLowerCase()];
                return priorityB - priorityA;
            });
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const isCategory = (reminder) => {
        const newCats = selectedCategories.filter(c => c.name === reminder.category.name);
        return newCats.length > 0
    }

    const days = (i) => {
        const diff = date.getDay() - i
        const lastDay = new Date(date.getYear(), date.getMonth() + 1, 0)
        if (date.getDate() - diff < 1) {
            //need to get prev month ending
            return (<WeeklyDay key={i}><BeforeMonth sx={{ fontSize: '26px' }}>{prevMonthlast - (diff - 1)}</BeforeMonth></WeeklyDay>)
        }
        if (date.getDate() - diff > lastDay.getDate()) {
            return (<WeeklyDay key={i}><AfterMonth sx={{ fontSize: '26px' }}>{(date.getDate() - diff) - lastDay.getDate()}</AfterMonth></WeeklyDay>)
        }
        const newDate = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - diff}`)
        const remindersForDay = reminders.filter((reminder) => {
            const reminderTime = new Date(reminder.date)
            const isSameDay =
                reminderTime.getUTCFullYear() === newDate.getFullYear() &&
                reminderTime.getUTCMonth() === newDate.getMonth() &&
                reminderTime.getUTCDate() === newDate.getDate();

            return isSameDay;
        });

        const reminderCount = remindersForDay.length;

        const highestPriorityReminder = reminderCount > 0 ? remindersForDay[0] : null;

        const hasReminder = highestPriorityReminder !== null;
        let progress = 0;

        if (hasReminder) {
            const currentDate = new Date();
            const reminderDate = new Date(highestPriorityReminder.time);
            const timeDiff = reminderDate.getTime() - currentDate.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            progress = Math.max(0, Math.min(100, (7 - daysDiff) * 100 / 7));
        }
        if (view === 'daily' && remindersForDay) {
            return (
                <DailyDay key={i} sx={{ background: date.getDate() - diff === day ? theme.palette.secondary.contrastText : 'transparent', }}>
                    <DuringMonth sx={{ fontSize: '26px' }}>{date.getDate() - diff}</DuringMonth>

                    {
                        remindersForDay && (reminderCount <= 8) && remindersForDay.map(r => {
                            const time = formatAMPM(new Timestamp(r.time.seconds, r.time.nanoseconds).toDate())
                            const hours = Number(r.duration.split(':')[0]);
                            const minutes = Number(r.duration.split(':')[1]);
                            if (isCategory(r)) {
                                return (
                                    <>
                                        <Reminder style={{ background: r.category.color, cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedReminder(r);
                                                setShowPopup(true);
                                            }}
                                        >
                                            <Typography variant='body1'>{r.title}</Typography>
                                            <Typography variant='body1'>{time}</Typography>
                                            <Typography variant='body1'>{hours} hour(s) {minutes} minutes</Typography>
                                            <LinearProgress variant="determinate" value={progress} /></Reminder>
                                    </>
                                )
                            }
                        })
                    }
                    {
                        (reminderCount > 8) &&
                        <div style={{ background: theme.palette.primary.main, width: '70%', margin: 'auto', padding: '5px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                            onClick={() => {
                                setAllRemindersOpen(true)
                                setDayReminders(remindersForDay)
                                setReminderDay(i + 1)
                            }}
                        >
                            SHOW ALL REMINDERS
                        </div>
                    }
                    {reminderCount > 0 && (<div style={{ position: 'absolute', bottom: '0', paddingLeft: '4px' }}>{reminderCount} {reminderCount === 1 ? 'Reminder' : 'Reminders'}</div>)}
                </DailyDay>
            )
        } else if (view === 'daily') {
            return
        }
        console.log('day', day)

        return (

            <WeeklyDay key={i} sx={{ background: date.getDate() - diff === day ? theme.palette.secondary.contrastText : 'transparent', }}>
                <DuringMonth sx={{ fontSize: '26px' }}>{date.getDate() - diff}</DuringMonth>

                {
                    remindersForDay && (reminderCount <= 8) && remindersForDay.map(r => {
                        const time = formatAMPM(new Timestamp(r.time.seconds, r.time.nanoseconds).toDate())
                        const hours = Number(r.duration.split(':')[0]);
                        const minutes = Number(r.duration.split(':')[1]);
                        if (isCategory(r)) {
                            return (
                                <>
                                    <Reminder style={{ background: r.category.color, cursor: 'pointer' }}
                                        onClick={() => {
                                            setSelectedReminder(r);
                                            setShowPopup(true);
                                        }}
                                    >
                                        <Typography variant='body1'>{r.title}</Typography>
                                        <Typography variant='body1'>{time}</Typography>
                                        <Typography variant='body1'>{hours} hour(s) {minutes} minutes</Typography>
                                        <LinearProgress variant="determinate" value={progress} />
                                    </Reminder>
                                </>
                            )
                        }
                    })
                }
                {
                    (reminderCount > 8) &&
                    <div style={{ background: theme.palette.primary.main, width: '70%', margin: 'auto', padding: '5px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => {
                            setAllRemindersOpen(true)
                            setDayReminders(remindersForDay)
                            setReminderDay(i + 1)
                        }}
                    >
                        SHOW ALL REMINDERS
                    </div>
                }
                {reminderCount > 0 && (<div style={{ position: 'absolute', bottom: '0', paddingLeft: '4px' }}>{reminderCount} {reminderCount === 1 ? 'Reminder' : 'Reminders'}</div>)}
            </WeeklyDay>
        );

    }

    const handleEdit = (thread) => {
        // Open the edit modal
        setEditedActivity(thread.comment);
        setEditModalOpen(true);
        setEditThread(thread); // Store the current thread being edited
    };

    const handleEditSubmit = async () => {
        // Update the discussion thread with the edited values
        const updatedThreads = activity.map((t) => {
            if (t === editThread) {
                return {
                    ...t,
                    comment: editedActivity,
                };
            }
            return t;
        });

        const reminderRef = doc(firestore, 'reminders', selectedReminder.docId);
        await updateDoc(reminderRef, {
            activity: updatedThreads
        }).then(() => {
            setActivity(updatedThreads);
            setEditModalOpen(false);
            setEditedActivity('')

        })


        // Close the edit modal
    };

    const handleDelete = async (thread) => {
        try {
            // Delete the discussion thread from the Firestore database
            const reminderRef = doc(firestore, 'reminders', selectedReminder.docId);
            const updatedThreads = activity.filter((t) => t !== thread);

            await updateDoc(reminderRef, {
                activity: updatedThreads.length > 0 ? updatedThreads : []
            });

            setActivity(updatedThreads);
        } catch (error) {
            console.error('Error deleting discussion thread:', error);
        }
    };

    const closeEditModal = () => {
        setEditModalOpen(false)
        setEditThread(null)
        setEditedActivity('')
    }
    Date.prototype.today = function () {
        return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }

    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes()
    }

    const isAttachedReminderCompleted = dependency ? dependency.isComplete : false;

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
                        onKeyDown={handleKeyDown}
                    />
                    <SearchButton onClick={handleSearch}>Search</SearchButton>
                </SearchBar>

                {/* Suggestions list */}
                {searchTerm && (
                    <datalist id="suggestions">
                        {reminders
                            .filter((reminder) => reminder.title.includes(searchTerm))
                            .map((reminder) => (
                                <option key={reminder.id} value={reminder.title} />
                            ))}
                    </datalist>
                )}

                {/* Modal */}
                {showModal && (
                    <CustomModal open={showModal} onClose={closeModal}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', background: theme.palette.primary.border, padding: '20px', borderRadius: '8px', width: '50%', gap: '20px', maxHeight: '80vh', overflow: 'auto', }}>
                            <Typography variant='h3' paddingLeft={'5px'}>All Results for "{searchTerm}" : </Typography>
                            <hr />
                            <div style={{ display: 'grid', }}>
                                <div className="sort-by">
                                    <label htmlFor="sort-select">Sort By:</label>
                                    <select id="sort-select" value={sortBy} onChange={handleSortChange}>
                                        <option value="title">Title</option>
                                        <option value="priority">Priority</option>
                                        <option value="duration">Duration</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gridColumnGap: '20px', padding: '10px' }}>
                                    <Typography>Title</Typography>
                                    <Typography>Category</Typography>
                                    <Typography>Time</Typography>
                                    <Typography>Priority</Typography>
                                    <Typography>Duration</Typography>
                                    <div style={{ width: '24px', marginRight: '20px' }}></div>
                                </div>

                                {searchResults && searchResults.map(reminder => {
                                    const hours = Number(reminder.duration.split(':')[0]);
                                    const minutes = Number(reminder.duration.split(':')[1]);
                                    const time = formatAMPM(new Timestamp(reminder.time.seconds, reminder.time.nanoseconds).toDate());

                                    return (
                                        <div
                                            onClick={() => {
                                                closeModal();
                                                setSelectedReminder(reminder);
                                                setShowPopup(true);
                                            }}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(5, 1fr) auto',
                                                background: theme.palette.primary.dark,
                                                padding: '20px 10px',
                                                borderRadius: '8px',
                                                marginBottom: '10px',
                                                alignItems: 'center',
                                                gridColumnGap: '20px'
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: '600' }}>
                                                {reminder.title}
                                            </Typography>
                                            <Typography variant="body1" sx={{ background: reminder.category.color, maxWidth: '160px', padding: '5px' }}>
                                                {reminder.category.name}
                                            </Typography>
                                            <Typography variant="body1">{time}</Typography> {/* Display the time */}
                                            <Typography variant="body1">{reminder.priority.toUpperCase()}</Typography> {/* Display the priority */}
                                            <Typography variant="body1">
                                                {hours} hour(s) {minutes} minutes
                                            </Typography>
                                            <p style={{ placeSelf: 'end', marginRight: '20px', display: 'inline-block', cursor: 'pointer' }}>
                                                <ArrowRightIcon />
                                            </p>
                                        </div>
                                    );
                                })}
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
            {(view === 'monthly' || view === 'weekly') &&
                (
                    <Row>
                        {weekdays.map((weekday, i) => (
                            <Typography variant='h6' key={i}>{weekday}</Typography>
                        ))}
                    </Row>

                )}
            {view === 'daily' && (
                <DailyRow>
                    {weekdays.map((weekday, i) => {
                        if (i === date.getDay()) {
                            return <Typography variant='h6' key={i}>{weekday}</Typography>
                        }
                    })}
                </DailyRow>
            )}

            {view === 'monthly' && (
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
                            const reminderTime = new Date(reminder.date);
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
                            const reminderDate = new Date(highestPriorityReminder.time);
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

                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        width: '100%',
                                        height: '100%',
                                        padding: 0,
                                        margin: 0,
                                    }}
                                >
                                    <DuringMonth>{i + 1}</DuringMonth>

                                    {remindersForDay && (reminderCount <= 2) && remindersForDay.map(r => {
                                        const time = formatAMPM(new Timestamp(r.time.seconds, r.time.nanoseconds).toDate())
                                        const hours = Number(r.duration.split(':')[0]);
                                        const minutes = Number(r.duration.split(':')[1]);
                                        if (isCategory(r)) {
                                            return (
                                                <>
                                                    <Reminder style={{ background: r.category.color, cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setSelectedReminder(r);
                                                            setShowPopup(true);
                                                        }}
                                                    >
                                                        <Typography variant='body1'>{r.title}</Typography>
                                                        <Typography variant='body1'>{time}</Typography>
                                                        <Typography variant='body1'>{hours} hour(s) {minutes} minutes</Typography>
                                                        <LinearProgress variant="determinate" value={progress} /></Reminder>
                                                </>
                                            )
                                        }
                                    })}
                                    {(reminderCount > 2) &&
                                        <div style={{ background: theme.palette.primary.main, width: '70%', margin: 'auto', padding: '5px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                                            onClick={() => {
                                                setAllRemindersOpen(true)
                                                setDayReminders(remindersForDay)
                                                setReminderDay(i + 1)
                                            }}
                                        >
                                            SHOW ALL REMINDERS
                                        </div>
                                    }
                                    {reminderCount > 0 && (<div style={{ position: 'absolute', bottom: '0', paddingLeft: '4px' }}>{reminderCount} {reminderCount === 1 ? 'Reminder' : 'Reminders'}</div>)}
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
            )}
            {view === 'weekly' && (
                <Calendar>
                    {weekdays.map((weekday, i) => (
                        <>
                            {days(i)}
                        </>
                    ))}
                </Calendar>
            )}
            {view === 'daily' && (
                <DailyCalendar>
                    {weekdays.map((weekday, i) => {
                        if (i === date.getDay()) {

                            return (
                                <>
                                    {days(i)}
                                </>
                            )
                        }
                    })}
                </DailyCalendar>
            )}

            <CustomModal open={showPopup} onClose={closePopup}>
                <div>
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
                                        <input
                                            type="checkbox"
                                            disabled={dependency}
                                            checked={isComplete}
                                            onChange={(e) => setIsComplete(e.target.checked)}
                                        />
                                        <Typography variant="body1">Mark as complete</Typography>
                                    </div>
                                </div>
                                <div>
                                    <Title>Attached Reminders:</Title>
                                    <div style={{ display: changeDep ? 'none' : 'flex', width: '50%', justifyContent: 'space-between', alignItems: 'center', background: theme.palette.primary.dark, padding: '10px', borderRadius: '8px' }}>
                                        {(dependency && !changeDep) &&
                                            <div>
                                                <Typography variant='h6'>{dependency.title}</Typography>
                                                <Typography variant='body1'>{formatAMPM(new Timestamp(dependency.time.seconds, dependency.time.nanoseconds).toDate())}</Typography>
                                            </div>
                                        }
                                        {!changeDep && <CustomButton text={'Change'} color={1} size={'s'} onClick={() => setChangeDep(true)} />}
                                    </div>
                                    {changeDep && <StyledAutoCompleteDiv>
                                        <Autocomplete
                                            options={['None', ...filterReminders()]}
                                            value={dependencyValue}
                                            onChange={(e, newVal) => (getNewVal(newVal))}
                                            inputValue={inputValue}
                                            onInputChange={(event, newInputValue) => {
                                                setInputValue(newInputValue);
                                            }}
                                            disablePortal
                                            id="reminder-attachment"
                                            PopperComponent={(props) => <Popper sx={{ color: 'black !important' }} {...props} placement='bottom'></Popper >}
                                            renderInput={(params) => <StyledTextField {...params} placeholder="Reminder Title" />}
                                        />
                                    </StyledAutoCompleteDiv>}
                                </div>
                                <div>
                                    <Title>Category:</Title>
                                    <CategorySelect value={category.name} sx={{ background: getCategoryBG() }} onChange={(e) => changeCategory(e.target.value)}>
                                        {categories && categories.map((c, idx) => (
                                            <MenuItem key={idx} value={c.name} sx={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                                                <Typography sx={{ display: 'inline-block' }}>{c.name}</Typography><BsCircleFill color={c.color} />
                                            </MenuItem>
                                        ))}
                                    </CategorySelect>
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
                                    <ProfileIcon img='default' setOpen={() => { }} />
                                    <OutlinedInput sx={{ color: '#fff' }} placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} endAdornment={<BsSend size={24} onClick={handleSaveDiscussion} />} />
                                </div>

                                {activity && activity.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '10px', paddingBottom: '10px' }}>

                                        {activity.map((thread, index) => {
                                            if ('seconds' in thread.time) {
                                                var datetime = new Date(thread.time.toDate()).today() + " @ " + formatAMPM(new Date(thread.time.toDate()));
                                            } else {
                                                var datetime = new Date(thread.time).today() + " @ " + formatAMPM(new Date(thread.time))
                                            }
                                            return (
                                                <Comment key={index}>
                                                    <ProfileIcon img={thread.photoURL} sx={{ gridRowStart: 1, gridRowEnd: 3 }} setOpen={() => { }} />
                                                    <Typography variant="h6" >{thread.email}</Typography>
                                                    <Typography variant="body1" sx={{ fontSize: '12px', opacity: '.5', alignSelf: 'center', textAlign: 'right' }}>{datetime}</Typography>
                                                    {(editModalOpen && editThread === thread) ?
                                                        <OutlinedInput defaultValue={thread.comment} value={editedActivity} onChange={(e) => setEditedActivity(e.target.value)} />
                                                        :
                                                        <Typography variant="body1">{thread.comment}</Typography>

                                                    }{ }
                                                    <div>
                                                        {(editModalOpen && editThread === thread) ?
                                                            <>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => handleEditSubmit()}
                                                                >
                                                                    Save
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => closeEditModal()}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </>

                                                            :
                                                            <>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => handleEdit(thread)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => handleDelete(thread)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </>
                                                        }
                                                    </div>
                                                </Comment>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <CustomButton onClick={closePopup} text={'Close'} color={0} size={'s'} />
                        <CustomButton onClick={submit} text={'Submit'} color={1} size={'s'} />

                    </Box>
                </div>
            </CustomModal >
            <AllReminders open={allRemindersOpen} setOpen={setAllRemindersOpen} reminders={dayReminders} setSelectedReminder={setSelectedReminder} setShowPopup={setShowPopup} reminderDay={reminderDay} month={month} formatAMPM={formatAMPM} />
        </Container >

    );
}

export default NewCalendar