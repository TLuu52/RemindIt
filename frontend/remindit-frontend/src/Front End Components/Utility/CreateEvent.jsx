import { Box, FormLabel, Input, MenuItem, Modal, OutlinedInput, Select, TextareaAutosize, Typography, styled } from "@mui/material"
import ProfileIcon from "./ProfileIcon"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import CustomButton from "./CustomButton"
import { BsCircleFill } from "react-icons/bs"
import { useTheme } from "@emotion/react"
import { useState } from "react"
import { collection, doc, getDocs, setDoc } from "firebase/firestore"
import { auth, firestore } from "../../firebase"

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
    }
}))
const Circle = styled('div')({
    height: '50px',
    width: '50px',
    zIndex: '99'
})


function CreateEvent({ open, handleClose, }) {
    const theme = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [priority, setPriority] = useState('');
    const [value, onChange] = useState(new Date());

    const submit = async (e) => {
        e.preventDefault();

        try {
            // Check if the "reminders" collection exists, create it if it doesn't
            const remindersCollectionRef = collection(firestore, "reminders");
            const collectionSnapshot = await getDocs(remindersCollectionRef);
            if (collectionSnapshot.empty) {
                await setDoc(doc(firestore, "metadata", "remindersCollection"), {
                    exists: true,
                });
            }

            // Create a new document in the "reminders" collection with the user's ID
            const remindersDocRef = doc(firestore, "reminders", auth.currentUser.uid);

            await setDoc(remindersDocRef, {
                title: title,
                description: description,
                activity: activity,
                time: time,
                date: date,
                priority: priority,
            });

            // Close the modal or perform any other necessary actions
            handleClose();
            console.log("Reminder saved successfully.");
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

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
                            <DatePicker value={date} onChange={setDate} sx={{
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
                            <FormLabel>Priority</FormLabel>
                            <StyledSelect value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <MenuItem value={'low'}>
                                    <Typography variant='subtitle1'>Low</Typography>
                                    <BsCircleFill color={theme.palette.success.light} />
                                </MenuItem>
                                <MenuItem value={'medium'}>
                                    <Typography variant='subtitle1'>Medium</Typography>
                                    <BsCircleFill color={theme.palette.warning.light} />
                                </MenuItem>
                                <MenuItem value={'high'}>
                                    <Typography variant='subtitle1'>High</Typography>
                                    <BsCircleFill color={theme.palette.error.light} />
                                </MenuItem>
                            </StyledSelect>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                            <CustomButton size={'s'} text={'Cancel'} onClick={handleClose} />
                            <CustomButton onClick={submit} size={'s'} text={'Create'} color={1} />
                        </div>
                    </Flex>
                </ModalRight>
            </Box>
        </CustomModal>
    )
}

export default CreateEvent