import { Box, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, styled, useTheme } from '@mui/material';
import { BsBellFill } from 'react-icons/bs';
import ProfileIcon from './ProfileIcon';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const End = styled('div')({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'end',
    gap: '10px'
})
const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.primary.contrastText
}))
const CustomPaper = styled(Paper)(({ theme }) => ({
    background: theme.palette.primary.light
}))


function Header() {
    const theme = useTheme();
    const [open, setOpen] = useState(false)
    const anchorRef = useRef(null);
    const navigate = useNavigate();

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

    return (
        <End>
            <BsBellFill color={theme.palette.primary.light} size="30px" />
            <Box ref={anchorRef}>
                <ProfileIcon open={open} setOpen={setOpen} />
            </Box>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="left-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'right bottom' : 'right top',
                        }}
                    >
                        <CustomPaper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <CustomMenuItem onClick={() => navigate('/profile')}>Profile</CustomMenuItem>
                                    {/* IMPLEMENT LOGOUT WHEN ABLE TO */}
                                    <CustomMenuItem onClick={() => navigate('/login')}>Logout</CustomMenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </CustomPaper>
                    </Grow>
                )}
            </Popper>
        </End >
    )
}

export default Header