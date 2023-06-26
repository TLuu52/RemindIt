import { ButtonGroup, Button, Typography, styled, useTheme, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, Timestamp, addDoc, doc, deleteDoc} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [uploadedAttachment, setUploadedAttachment] = useState(null);
    const [notes, setNotes] = useState('');
    const [notesAttachments, setNotesAttachments] = useState([]);


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

    // Fetch the data from the "NotesAttachments" collection
    useEffect(() => {
        const fetchNotesAttachments = async () => {
            try {
                const notesattachmentsCollectionRef = collection(firestore, 'NotesAttachments');
                const notesattachmentsSnapshot = await getDocs(notesattachmentsCollectionRef);
                const notesattachmentsData = notesattachmentsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotesAttachments(notesattachmentsData);
            } catch (error) {
                console.error('Error fetching notes and attachments: ', error);
            }
        };

        fetchNotesAttachments();
    }, [notes]);


    const storage = getStorage(); // Initialize Firebase Storage

    const submit = async (e) => {
        e.preventDefault();

        try {
            // Get the current user ID
            const user = auth.currentUser;
            const userId = user.uid;

            // Upload the attachment file to Firebase Storage
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

            // Create a new document in the "NotesAttachments" collection
            const notesattachmentsCollectionRef = collection(firestore, 'NotesAttachments');
            const newNotesAttachmentsDocRef = await addDoc(notesattachmentsCollectionRef, {
                notes: notes,
                attachmentUrl: downloadURL,
                userId: userId,
            });

            closePopup();
            console.log('Notes and Attachments saved successfully. Document ID:', newNotesAttachmentsDocRef.id);
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

            <Dialog open={showPopup} onClose={closePopup}>
                <DialogTitle>
                    <Typography sx={{ fontWeight: 'lighter' }}>{selectedReminder && selectedReminder.title}</Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedReminder && (
                        <>
                            <div>Priority: {selectedReminder.priority}</div>
                            <div>Description: {selectedReminder.description}</div>
                            <div>Activity: {selectedReminder.activity}</div>
                            <div>Duration: {selectedReminder.duration}</div>
                            <div>
                                <TextField
                                    label="Notes"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="attachment-upload">Upload Attachment:</label>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    id="attachment-upload"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setUploadedAttachment(e.target.files[0])}
                                />
                            </div>
                            {uploadedAttachment && (
                                <div>
                                    <Typography variant="subtitle1">Saved Attachment:</Typography>
                                    <Typography>
                                        <a href={URL.createObjectURL(uploadedAttachment)} download={uploadedAttachment.name}>
                                            {uploadedAttachment.name}
                                        </a>
                                    </Typography>
                                </div>
                            )}

                            {/* Display notes and attachments */}
                            {notesAttachments.map((item) => (
                                <div key={item.id}>
                                    <Typography variant="subtitle1">Notes:</Typography>
                                    <Typography>{item.notes}</Typography>
                                    {item.attachmentUrl && (
                                        <div>
                                            <Typography variant="subtitle1">Attachment:</Typography>
                                            <Typography>
                                                <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                                    {item.attachmentUrl}
                                                </a>
                                            </Typography>
                                        </div>
                                    )}
                                    <Button onClick={() => deleteNotesAttachment(item.id)}>Delete</Button>
                                </div>
                            ))}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={submit}>Submit</Button>
                    <Button onClick={closePopup}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>

    );
}

export default NewCalendar