import React, { useState, useRef } from 'react';
import { Box, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, styled, useTheme, Modal } from '@mui/material';
import { BsBellFill } from 'react-icons/bs';
import ProfileIcon from './ProfileIcon';
import { useNavigate } from 'react-router-dom';
import NotificationBox from './NotificationBox';
import { auth } from '../../firebase';
import Logo from './Logo';
import CustomButton from './CustomButton';

const End = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    width: '100%',
});
const Container = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
});
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
}));
const CustomPaper = styled(Paper)(({ theme }) => ({
    background: theme.palette.primary.light,
}));
const CustomBox = styled(Box)(({ theme }) => ({
    background: theme.palette.primary.border
}))

function Header({ absolute, updateReminders }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [showNotificationBox, setShowNotificationBox] = useState(false);
    const anchorRef = useRef(null);
    const navigate = useNavigate(); // Add the useNavigate hook to navigate between routes

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const handleBellClick = () => {
        setShowNotificationBox(true);
    };

    const handleNotificationBoxClose = () => {
        setShowNotificationBox(false);
    };

    const logout = async () => {
        await auth.signOut()
        navigate('/')
    }

    return (
        <End
            sx={{
                width: absolute && '100vw',
                position: absolute && 'absolute',
                padding: absolute && '20px',
                top: absolute && 0,
                left: absolute && 0,
            }}
        >
            <Logo size={'180px'} onClick={() => navigate('/dashboard')} />
            <Container>
                <BsBellFill color={theme.palette.primary.light} size="30px" onClick={handleBellClick} />
                <Box ref={anchorRef}>
                    <ProfileIcon open={open} setOpen={setOpen} img={'default'} />
                </Box>
                <Popper open={open} anchorEl={anchorRef.current} placement="left-start" transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom-start' ? 'right bottom' : 'right top',
                            }}
                        >
                            <CustomPaper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                                        <CustomMenuItem onClick={() => navigate('/profile')}>Profile</CustomMenuItem>
                                        {/* IMPLEMENT LOGOUT WHEN ABLE TO */}
                                        <CustomMenuItem onClick={logout}>Logout</CustomMenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </CustomPaper>
                        </Grow>
                    )}
                </Popper>
            </Container>
            <Modal open={showNotificationBox} onClose={handleNotificationBoxClose} sx={{ display: 'grid', placeItems: 'center' }}>
                <CustomBox sx={{ padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', }}>
                    <NotificationBox updateReminders={updateReminders} />
                    <CustomButton sx={{ width: '100%' }} onClick={handleNotificationBoxClose} text='Close Notifications' color={0} />
                </CustomBox>
            </Modal>
        </End>
    );
}

export default Header;