import { Box, FormLabel, Input, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextareaAutosize, Typography } from '@mui/material';
import React, { useState } from 'react'
import ProfileIcon from './ProfileIcon';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { BsCircleFill } from 'react-icons/bs';
import CustomButton from './CustomButton';
import styled from '@emotion/styled';
import CustomInput from './CustomInput';
import { useTheme } from '@emotion/react';

const CustomModal = styled(Modal)(({ }) => ({
    display: 'grid',
    placeItems: 'center'
}));

const ColorPicker = styled('input')(({ }) => ({
    width: "50px",
    height: "50px",
    outline: 'none',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
}))

const Flex = styled('div')(({ }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    minWidth: '600px'
}))
const End = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    gap: '10px'
})
function CreateCategory({ open, handleClose }) {
    const theme = useTheme();

    const [color, setColor] = useState(theme.palette.primary.main);
    const [categoryName, setCategoryName] = useState('');


    return (
        <CustomModal
            open={open}
            onClose={handleClose}
            aria-labelledby="CustomModal-modal-title"
            aria-describedby="modal-modal-description" >
            <Box sx={{ display: 'flex', flexDirection: 'column', background: theme.palette.secondary.main, padding: '20px', borderRadius: '8px', width: '50%', gap: '20px' }}>
                <Typography variant='h3'>Create Category</Typography>
                <hr />
                <Flex>
                    <InputLabel >Category Name</InputLabel>
                    <CustomInput size={'s'} value={categoryName} onChange={e => setCategoryName(e.target.value)} />
                </Flex>
                <Flex>
                    <InputLabel >Category Color</InputLabel>
                    <ColorPicker placeholder={"Color"} type={"color"} value={color} onChange={e => setColor(e.target.value)} />
                </Flex>
                <hr />
                <End>
                    <CustomButton color={0} text="Cancel" size='s' onClick={handleClose} />
                    <CustomButton color={1} text="Save" size='s' />
                </End>
            </Box>
        </CustomModal>
    )
}

export default CreateCategory