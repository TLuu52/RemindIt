import Header from './Utility/Header'
import { styled } from '@mui/material'
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import CustomCalendar from './Utility/CustomCalendar';
import EventFilter from './Utility/EventFilter';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // a plugin!
import NewCalendar from './Utility/NewCalendar';




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

function TestDashboard() {
    const [value, onChange] = useState(new Date());
    const [view, setView] = useState({ view: 'dayGridMonth', day: '2023-06-13' })
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false); // State to manage filter section visibility
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');


    const changeView = (e) => {
        setView({ view: e.target.value.view, day: e.target.value.day })
    }

    const handleSearch = () => {
        // Handle the search functionality here
        console.log('Search term:', searchTerm);
    };

    const toggleFilter = () => {
        setShowFilter(!showFilter); // Toggle filter section visibility
    };

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleFilterSubmit = () => {
        // Perform filtering based on selected options
        // You can access the keyword, selectedDate, and selectedCategory here
        // Example:
        console.log('Keyword:', keyword);
        console.log('Selected Category:', selectedCategory);
    };


    return (
        <Page>
            <Header />
            <Main>

                <Left>
                    <CustomCalendar onChange={onChange} value={value} />
                    <EventFilter />
                </Left>
                <Right>
                    <SearchBar onClick={toggleFilter}>
                        <SearchInput type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <SearchButton onClick={handleSearch}>Search</SearchButton>
                        {showFilter && (
          <FilterSection>
            <FilterLabel>Keyword:</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Enter keyword"
              value={keyword}
              onChange={handleKeywordChange}
            />
            <FilterLabel>Category:</FilterLabel>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              <option value="category3">Category 3</option>
            </select>
            <FilterButton onClick={handleFilterSubmit}>Apply Filter</FilterButton>
          </FilterSection>
        )}
                    </SearchBar>
                    <NewCalendar date={value} setDate={onChange} />
                </Right>
            </Main>
        </Page >
    )
}

export default TestDashboard