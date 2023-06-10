import { useTheme } from '@mui/material'
import ProfileImg from '../../Icons/ProfileIcon.png'

function ProfileIcon() {
    const theme = useTheme();
    return (
        // USE IMAGE FROM DB IF USER HAS CUSTOM IMAGE
        <img src={ProfileImg} alt="Profile Picture" style={{ height: '45px', borderRadius: '50%', border: `solid 2px ${theme.palette.primary.border}` }} />
    )
}

export default ProfileIcon