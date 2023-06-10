import { styled, useTheme } from '@mui/material';
import { BsBellFill } from 'react-icons/bs';
import ProfileIcon from './ProfileIcon';

const End = styled('div')({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'end',
    gap: '10px'
})

function Header() {
    const theme = useTheme();

    return (
        <End>
            <BsBellFill color={theme.palette.primary.light} size="30px" />
            <ProfileIcon />
        </End>
    )
}

export default Header