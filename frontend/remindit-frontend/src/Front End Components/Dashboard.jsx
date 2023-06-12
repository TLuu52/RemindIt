import Logo from './Utility/Logo'
import Header from './Utility/Header'
import { styled, useTheme } from '@mui/material'
import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import CustomCalendar from './Utility/CustomCalendar';

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
    height: '100%'
})
const Left = styled('div')(({ theme }) => ({
    width: '25%',
    height: '100%',

}))
const Right = styled('div')({

})
function Dashboard() {
    const [value, onChange] = useState(new Date());
    const theme = useTheme();

    return (
        <Page>
            <TopCorner>
                <Logo />
            </TopCorner>
            <Header />
            <Main>

                <Left>
                    <CustomCalendar onChange={onChange} value={value} />
                </Left>
                <Right></Right>
            </Main>
        </Page>
    )
}

export default Dashboard