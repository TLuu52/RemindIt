import { styled } from "@mui/material";
import Calendar from "react-calendar";

const Container = styled('div')(({ theme }) => ({
    '& .react-calendar': {
        background: theme.palette.primary.border,
        border: 'none',
        color: theme.palette.primary.contrastText,
        fontFamily: 'Inter',
        padding: '10px',
        borderRadius: '16px',
        width: '100%',
        '& .react-calendar__navigation .react-calendar__navigation__label': {
            color: theme.palette.primary.contrastText,
            fontWeight: '800',
            fontSize: '16px',
            '& .react-calendar__navigation__label__labelText': {
                fontFamily: 'Inter'
            }
        },
        '& .react-calendar__month-view__weekdays abbr': {
            textDecoration: 'none',
            fontWeight: '500'
        },
        '& .react-calendar__month-view__days__day--weekend, .react-calendar__month-view__days__day': {
            color: theme.palette.primary.contrastText,
            fontWeight: '300'
        },
        '& .react-calendar__month-view__days__day--neighboringMonth': {
            color: 'rgba(255,255,255,.3)'
        },
        '& .react-calendar__tile--now abbr': {
            background: theme.palette.primary.light,
            borderRadius: '50%'
        },
        '& .react-calendar__tile--now': {
            background: 'transparent',
        },
        '& .react-calendar__tile:enabled:hover': {
            backgroundColor: theme.palette.secondary.main
        },
        '& .react-calendar__tile--active abbr': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%'
        },
        '& .react-calendar__tile abbr': {
            height: '40px !important',
            width: '40px !important',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            margin: 'auto'
        },
        '& .react-calendar__tile--active, .react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus': {
            backgroundColor: 'transparent',
        },
        '& .react-calendar__navigation__arrow': {
            color: theme.palette.primary.light,
            fontSize: '24px',
            fontWeight: '700'
        }
    }
}))

function CustomCalendar({ onChange, value }) {
    return (
        <Container><Calendar onChange={onChange} value={value} /></Container>
    )
}

export default CustomCalendar