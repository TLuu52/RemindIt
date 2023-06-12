import { styled, useTheme } from '@mui/material'
import ProfileImg from '../../Icons/ProfileIcon.png'

const CustomImg = styled('img')(({ theme }) => ({
    height: '45px',
    borderRadius: '50%',
    border: `solid 2px ${theme.palette.primary.border}`
}))

function ProfileIcon({ size, open, setOpen }) {
    const theme = useTheme();
    return (
        // USE IMAGE FROM DB IF USER HAS CUSTOM IMAGE
        <>
            {size === 'l' ? <CustomImg src={ProfileImg} alt="Profile Picture" style={{ height: '150px' }} /> :
                <CustomImg src={ProfileImg} alt="Profile Picture" onClick={() => setOpen(!open)} />
            }
        </>
    )
}

export default ProfileIcon