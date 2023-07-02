import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Modal, Typography } from "@mui/material";
import { BsArrowBarRight, BsCircleFill } from "react-icons/bs";
import CustomButton from "./CustomButton";
import { Timestamp } from "firebase/firestore";
import { ArrowRightIcon } from "@mui/x-date-pickers";


const ReminderItem = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '4px',
    background: theme.palette.primary.dark,
    marginBottom: '4px',
    '& div': {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    }
}))

function AllReminders({ open, setOpen, reminders, setSelectedReminder, setShowPopup, reminderDay, month, formatAMPM }) {
    const theme = useTheme()
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            sx={{ display: 'grid', placeItems: 'center' }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', background: theme.palette.primary.border, padding: '20px', borderRadius: '8px', width: '50%', gap: '20px' }}>
                <Typography variant='h3' paddingLeft={'5px'}>All Reminders for {month} {reminderDay}</Typography>
                <hr />
                <div style={{ display: 'grid', }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '10px' }}>
                        <Typography>Title</Typography>
                        <Typography>Category</Typography>
                        <Typography>Time</Typography>
                        <Typography>Duration</Typography>
                    </div>
                    {reminders && reminders.map(reminder => {
                        const hours = Number(reminder.duration.split(':')[0]);
                        const minutes = Number(reminder.duration.split(':')[1]);
                        const time = formatAMPM(new Timestamp(reminder.time.seconds, reminder.time.nanoseconds).toDate())

                        return (
                            <div onClick={() => {
                                setOpen(false)
                                setSelectedReminder(reminder)
                                setShowPopup(true)
                            }}
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', background: theme.palette.primary.dark, padding: '20px 10px', borderRadius: '8px', marginBottom: '10px', alignItems: 'center' }}
                            >
                                <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: '600' }}>{reminder.title}</Typography>
                                <Typography variant="body1" sx={{ background: reminder.category.color, maxWidth: '180px', padding: '5px' }}>{reminder.category.name}</Typography>
                                <Typography variant="body1">{time}</Typography>
                                <Typography variant="body1">{hours} hour(s) {minutes} minutes</Typography>
                                <p style={{ placeSelf: 'end', marginRight: '20px', display: 'inline-block', cursor: 'pointer' }}>
                                    <ArrowRightIcon />
                                </p>
                            </div>
                        )
                    })}
                </div>
            </Box>
        </Modal>
    )
}

export default AllReminders