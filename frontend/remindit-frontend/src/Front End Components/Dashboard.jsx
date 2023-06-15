import Logo from './Utility/Logo'
import Header from './Utility/Header'
import { MenuItem, Select, styled } from '@mui/material'
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import CustomCalendar from './Utility/CustomCalendar';
import EventFilter from './Utility/EventFilter';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!




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

function Dashboard() {
    const [value, onChange] = useState(new Date());
    const [view, setView] = useState({ view: 'dayGridMonth', day: '2023-06-13' })

    const changeView = (e) => {
        setView({ view: e.target.value.view, day: e.target.value.day })
    }
    return (
        <Page>
            <Header />
            <Main>

                <Left>
                    <CustomCalendar onChange={onChange} value={value} />
                    <EventFilter />
                </Left>
                <Right>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        weekends={false}
                        events={[
                            { title: 'event 1', date: '2023-06-01' },
                            { title: 'event 2', date: '2023-06-02' }
                        ]}
                        headerToolbar={{ start: 'prev,next today', center: 'title', end: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                        height={'90vh'}
                    />
                </Right>
            </Main>
        </Page >
    )
}

export default Dashboard