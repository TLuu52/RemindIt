import { styled } from '@mui/material'
import ProfileImg from '../../Icons/ProfileIcon.png'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'

const CustomImg = styled('img')(({ theme }) => ({
    height: '45px',
    width: '45px',
    borderRadius: '50%',
    border: `solid 2px ${theme.palette.primary.border}`,
    cursor: 'pointer',
    objectFit: 'cover'
}))

function ProfileIcon({ size, open, setOpen, img, sx }) {
    const [src, setSrc] = useState(ProfileImg)
    const { user } = useContext(UserContext)
    useEffect(() => {
        setTimeout(() => {
            if (user.currentUser) {
                setSrc(user.currentUser.photoURL === 'default' ? ProfileImg : user.currentUser.photoURL)
            }
        }, 250)
    }, [])
    useEffect(() => {
        setTimeout(() => {
            if (user.currentUser) {
                setSrc(user.currentUser.photoURL === 'default' ? ProfileImg : user.currentUser.photoURL)
            }
        }, 250)
    }, [img])
    return (
        // USE IMAGE FROM DB IF USER HAS CUSTOM IMAGE
        <>
            {size === 'l' ? <CustomImg src={img === 'default' ? src : img} alt="Profile Picture" style={{ ...sx, height: '150px', width: '150px' }} /> :
                <CustomImg src={img === 'default' ? src : img} alt="Profile Picture" onClick={() => setOpen(!open)} style={sx} />
            }
        </>
    )
}

export default ProfileIcon