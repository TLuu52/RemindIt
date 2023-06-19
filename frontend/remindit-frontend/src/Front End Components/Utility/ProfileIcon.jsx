import { styled } from '@mui/material'
import ProfileImg from '../../Icons/ProfileIcon.png'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'

const CustomImg = styled('img')(({ theme }) => ({
    height: '45px',
    borderRadius: '50%',
    border: `solid 2px ${theme.palette.primary.border}`,
    cursor: 'pointer'
}))

function ProfileIcon({ size, open, setOpen, img }) {
    const [src, setSrc] = useState(ProfileImg)
    const { user } = useContext(UserContext)
    useEffect(() => {
        setTimeout(() => {
            if (user.currentUser) {
                setSrc(user.currentUser.photoURL || ProfileImg)
            }
        }, 250)
    }, [])
    useEffect(() => {
        setTimeout(() => {
            console.log(user.currentUser)
            if (user.currentUser) {
                setSrc(user.currentUser.photoURL || ProfileImg)
            }
        }, 250)
    }, [img])
    return (
        // USE IMAGE FROM DB IF USER HAS CUSTOM IMAGE
        <>
            {size === 'l' ? <CustomImg src={img === 'default' ? src : img} alt="Profile Picture" style={{ height: '150px' }} /> :
                <CustomImg src={img === 'default' ? src : img} alt="Profile Picture" onClick={() => setOpen(!open)} />
            }
        </>
    )
}

export default ProfileIcon