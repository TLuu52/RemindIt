import { Box, FormLabel, Input, MenuItem, Modal, OutlinedInput, Select, TextareaAutosize, Typography, styled, FormControlLabel, Checkbox, Autocomplete, TextField, Popper } from "@mui/material"
import ProfileIcon from "./ProfileIcon"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import CustomButton from "./CustomButton"
import { BsCircleFill } from "react-icons/bs"
import { useTheme } from "@emotion/react"
import { useContext, useEffect, useState } from "react"
import { collection, addDoc, getDocs, setDoc, Timestamp, doc, getDoc } from "firebase/firestore"
import { auth, firestore } from "../../firebase"
import { UserContext } from "../../App"

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
        },
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
    display: 'flex',
    minHeight: '100%'
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
    gap: '20px',
    '& div': {
        display: 'flex',
        flexDirection: 'column'
    }
}))

const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: '6px',
    outline: 'none',
    border: 'none',
    background: theme.palette.custom.light,
    '& .MuiSelect-select': {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
    },
}))
const CustomSelect = styled(Select)({
    '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    }
})
const CustomMenuItem = styled(MenuItem)({
    display: 'flex', alignItems: 'center', gap: '10px',
})
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
const CustomPopper = styled(Popper)({
    '&.MuiPopper-root': {
        background: '#222 !important',

    }
})


function CreateEvent({ open, handleClose, fetchReminders, categories, getCategories, setCategories, reminders }) {
    const theme = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState([]);
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('');
    const [recurringOption, setRecurringOption] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');
    const { user } = useContext(UserContext)
    const [dependency, setDependency] = useState(false);
    const [dependencyValue, setDependencyValue] = useState('None');
    const [dependantReminder, setDependantReminder] = useState('')
    const [inputValue, setInputValue] = useState('');




    const handleDateChange = (newDate) => {
        // Update both date and time states
        setDate(newDate);
        setTime(newDate);
    };

    const submit = async (e) => {
        e.preventDefault();

        try {



            const dateValue = new Date(date).toLocaleDateString('en-us')
            const timeValue = new Date(time)


            // Get the current user ID
            const user = auth.currentUser;
            const userId = user.uid;

            const NewCategory = categories.filter((e) => {
                return e.name === category
            })[0]


            const remindersCollectionRef = collection(firestore, 'reminders');
            const newReminderDocRef = doc(collection(firestore, 'reminders'));


            await setDoc(newReminderDocRef
                , {
                    title: title,
                    description: description,
                    activity: activity,
                    time: timeValue,
                    date: dateValue,
                    priority: priority,
                    userId: userId, // Include the user ID in the reminder document
                    recurringOption: recurringOption, // Include the selected recurring option
                    duration: duration, // Include the duration of the reminder,
                    category: NewCategory,
                    docId: newReminderDocRef.id,
                    dependency: dependantReminder ? dependantReminder.docId : '', // Include the dependency option
                }).then(() => {
                    fetchReminders()
                })


            // Handle recurring options
            if (recurringOption !== 'No') {
                const recurringOptions = {
                    '1 week': { weeks: 1 },
                    '1 month': { months: 1 },
                    '1 year': { years: 1 }
                };

                const recurringOptionValue = recurringOptions[recurringOption];
                const initialDate = new Date(dateValue);

                // Create copies of the reminder based on the recurring option
                for (let i = 1; i <= 5; i++) {
                    const recurringDate = new Date(initialDate);

                    // Calculate the recurring date based on the recurring option
                    if (recurringOptionValue.weeks) {
                        recurringDate.setDate(initialDate.getDate() + (recurringOptionValue.weeks * 7 * i));
                    }
                    if (recurringOptionValue.months) {

                        recurringDate.setMonth(initialDate.getMonth() + (recurringOptionValue.months * i));
                    }
                    if (recurringOptionValue.years)
                        recurringDate.setFullYear(initialDate.getFullYear() + (recurringOptionValue.years * i));

                    // Set the time for recurring reminders
                    recurringDate.setHours(timeValue.getHours());
                    recurringDate.setMinutes(timeValue.getMinutes());

                    // Create a new document with the same data as the initial reminder
                    const newReminderCopyDocRef = doc(remindersCollectionRef);
                    console.log('RECURRING', recurringDate.toLocaleDateString('en-us'))

                    const recurringReminderData = {
                        title: title,
                        description: description,
                        activity: activity,
                        time: new Date(recurringDate),
                        date: recurringDate.toLocaleDateString('en-us'),
                        priority: priority,
                        userId: userId,
                        recurringOption: recurringOption,
                        duration: duration,
                        category: NewCategory,
                        docId: newReminderCopyDocRef.id,
                        dependency: dependantReminder ? dependantReminder.docId : '', // Include the dependency option

                    };

                    // Create the recurring reminder copy
                    await setDoc(newReminderCopyDocRef, recurringReminderData).then(() => {
                        console.log("SUCCESS")
                    }).catch(e => console.log(e))
                        ;
                }
            }

            // Fetch reminders
            fetchReminders();


            // Clear input fields
            setTitle('');
            setDescription('');
            setActivity([]);
            setTime('');
            setDate('');
            setPriority('');
            setDuration('');

            // Close the modal
            handleClose();

            console.log('Reminder saved successfully. Document ID:', newReminderDocRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    useEffect(() => {
        if (user.currentUser && categories === null) {
            setTimeout(() => {
                getCategories(setCategories);
            }, 400);
        }
    }, [user.currentUser])

    const changeCategory = (e) => {
        setCategory(e.target.value);
    }
    const filterReminders = () => {
        let uniqueNames = [];
        reminders.forEach(reminder => {
            if (!uniqueNames.includes(reminder.title)) {
                uniqueNames.push(reminder.title)
            }
        })
        return uniqueNames
    }

    const getNewVal = (newVal) => {
        if (newVal === null) {
            return
        }
        if (newVal != 'None') {
            setDependencyValue(reminders.filter(r => r.title === newVal)[0].title)
            setDependantReminder(reminders.filter(r => r.title === newVal)[0])
        } else {
            setDependencyValue('None')
            setDependantReminder('')
        }
    }
    return (

        <CustomModal
            open={open}
            onClose={handleClose}
            aria-labelledby="CustomModal-modal-title"
            aria-describedby="modal-modal-description" >
            <Box>
                <ModalLeft>
                    <Input placeholder={'Title'} value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Typography variant='h4'>Description</Typography>
                    <StyledTextarea placeholder={'Add a more detailed description...'} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <div>
                        <Typography variant='h6'>Category</Typography>
                        <CustomSelect value={category} onChange={(e) => changeCategory(e)}>
                            {categories && categories.map((c, idx) => (
                                <CustomMenuItem key={idx} value={c.name} sx={{ display: 'flex', alignItems: 'center', gap: '10px', }}>
                                    <Typography sx={{ display: 'inline-block' }}>{c.name}</Typography><BsCircleFill color={c.color} />
                                </CustomMenuItem>
                            ))}
                        </CustomSelect>
                    </div>
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
                            <DatePicker value={date} onChange={handleDateChange} sx={{
                                '& .MuiInputBase-root': {
                                    padding: '0px 20px'
                                }
                            }} />
                        </div>
                        <div>
                            <FormLabel>Time</FormLabel>
                            <TimePicker value={time} onChange={setTime} sx={{
                                '& .MuiInputBase-root': {
                                    padding: '0px 20px'
                                }
                            }} />
                        </div>
                        <div>
                            <FormLabel>Duration</FormLabel>
                            <OutlinedInput
                                placeholder={'Enter Duration (e.g., 00:00)'}
                                value={duration}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    // Remove non-time characters except ':'
                                    const formattedInput = input.replace(/[^0-9:]/g, '');
                                    // Limit the input to 4 to 5 numbers
                                    const limitedInput = formattedInput.slice(0, 5);
                                    // Split the limited input into hours and minutes
                                    const [hours, minutes] = limitedInput.split(':');
                                    // Format the hours and minutes as '00' if they exist
                                    const formattedHours = hours ? hours.padStart(2, '0') : '';
                                    const formattedMinutes = minutes ? minutes.padStart(2, '0') : '';
                                    // Combine the hours and minutes with a colon separator
                                    const formattedDuration = `${formattedHours}:${formattedMinutes}`;
                                    // Update the state with the formatted duration
                                    setDuration(formattedDuration);
                                }}
                                inputProps={{
                                    style: { textAlign: 'center' }
                                }}
                            />
                        </div>
                        <div>
                            <FormLabel>Priority</FormLabel>
                            <StyledSelect value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <CustomMenuItem value={'low'} sx={{}}>
                                    <Typography variant='subtitle1'>Low</Typography>
                                    <BsCircleFill color={theme.palette.success.light} />
                                </CustomMenuItem>
                                <CustomMenuItem value={'medium'}>
                                    <Typography variant='subtitle1'>Medium</Typography>
                                    <BsCircleFill color={theme.palette.warning.light} />
                                </CustomMenuItem>
                                <CustomMenuItem value={'high'}>
                                    <Typography variant='subtitle1'>High</Typography>
                                    <BsCircleFill color={theme.palette.error.light} />
                                </CustomMenuItem>
                            </StyledSelect>
                        </div>
                        <div>
                            <FormLabel>Make this a Recurring Reminder?</FormLabel>
                            <StyledSelect value={recurringOption} onChange={(e) => setRecurringOption(e.target.value)}>
                                <MenuItem value="No">No</MenuItem>
                                <MenuItem value="1 week">1 week</MenuItem>
                                <MenuItem value="1 month">1 month</MenuItem>
                                <MenuItem value="1 year">1 year</MenuItem>
                            </StyledSelect>
                        </div>
                        <StyledAutoCompleteDiv>
                            <FormLabel>Attach Reminder </FormLabel>
                            {/* NOTE FOR UPDATE: REMINDER NAMES MUST BE UNIQUE UNLESS IT IS RECURRING */}
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
                        </StyledAutoCompleteDiv>
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', }}>
                            <CustomButton size={'s'} text={'Cancel'} onClick={handleClose} color={0} />
                            <CustomButton onClick={submit} size={'s'} text={'Create'} color={1} />
                        </div>
                    </Flex>
                </ModalRight>
            </Box>
        </CustomModal >
    )
}

export default CreateEvent