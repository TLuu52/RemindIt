import { Button, Container, Switch, Typography, styled } from "@mui/material"
import { BsCircleFill, BsPlus } from "react-icons/bs"

const CustomContainer = styled(Container)(({ theme }) => ({
    background: theme.palette.primary.border,
    padding: '10px',
    borderRadius: '16px',
}))
const Top = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.primary.contrastText,
    width: '100%',
    '& svg path': {
        strokeWidth: '1px',
        color: theme.palette.primary.contrastText
    }
}))
const List = styled('div')({
    marginTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
})
const ListItem = styled('div')({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: "center"
})
const ItemTitle = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '18px'
})

function EventFilter() {
    return (
        <CustomContainer>
            <Top>
                <Typography variant="h6">Events</Typography>
                <Button sx={{ borderRadius: '50%', height: 'fit-content', width: 'fit-content', padding: '0', minWidth: 'auto' }}>
                    <BsPlus size={28} />
                </Button>
            </Top>
            <hr />
            <List>
                <ListItem>
                    <ItemTitle>
                        {/* COLOR MUST BE CHANGED TO FIT WHAT USER STORES FOR THIS CATEGORY */}
                        <BsCircleFill size={14} color={"#4BCFFA"} />
                        <Typography variant="h6">Homework</Typography>
                    </ItemTitle>
                    <Switch />
                </ListItem>
                <ListItem>
                    <ItemTitle>
                        {/* COLOR MUST BE CHANGED TO FIT WHAT USER STORES FOR THIS CATEGORY */}
                        <BsCircleFill size={14} color={"#607D8B"} />
                        <Typography variant="h6">Exams</Typography>
                    </ItemTitle>
                    <Switch />
                </ListItem>
                <ListItem>
                    <ItemTitle>
                        {/* COLOR MUST BE CHANGED TO FIT WHAT USER STORES FOR THIS CATEGORY */}
                        <BsCircleFill size={14} color={"#22C7C9"} />
                        <Typography variant="h6">Meetings</Typography>
                    </ItemTitle>
                    <Switch />
                </ListItem>
                <ListItem>
                    <ItemTitle>
                        {/* COLOR MUST BE CHANGED TO FIT WHAT USER STORES FOR THIS CATEGORY */}
                        <BsCircleFill size={14} color={"#FABE09"} />
                        <Typography variant="h6">Sprints</Typography>
                    </ItemTitle>
                    <Switch />
                </ListItem>
                <ListItem>
                    <ItemTitle>
                        {/* COLOR MUST BE CHANGED TO FIT WHAT USER STORES FOR THIS CATEGORY */}
                        <BsCircleFill size={14} color={"#D46B67"} />
                        <Typography variant="h6">Presentations</Typography>
                    </ItemTitle>
                    <Switch />
                </ListItem>
            </List>
        </CustomContainer>
    )
}

export default EventFilter