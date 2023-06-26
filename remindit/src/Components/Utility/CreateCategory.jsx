import { Box, InputLabel, Modal, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react'

import CustomButton from './CustomButton';
import styled from '@emotion/styled';
import CustomInput from './CustomInput';
import { useTheme } from '@emotion/react';
import { FieldValue, collection, doc, getDoc, query, updateDoc, where } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { UserContext } from '../../App';

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
    minWidth: '700px'
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
    const [categories, setCategories] = useState(null)
    const { user } = useContext(UserContext)

    const getCategories = async () => {
        const categoryDocRef = doc(firestore, 'categories', user.currentUser.uid);
        const docSnap = await getDoc(categoryDocRef)

        if (docSnap.exists()) {
            setCategories(docSnap.data().categories)
        } else {
            console.log('NOT FOUND')
        }
    }

    useEffect(() => {
        if (user.currentUser && categories === null) {
            setTimeout(() => {
                getCategories()
            }, 400)
        }
    })

    const onSubmit = async () => {
        setCategories([...categories, { name: categoryName, color: color }])

        const categoryDocRef = doc(firestore, 'categories', user.currentUser.uid);
        await updateDoc(categoryDocRef, {
            categories: [...categories, { name: categoryName, color: color }]
        })
        getCategories()
    }


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
                    <CustomButton color={1} text="Save" size='s' onClick={onSubmit} />
                </End>
            </Box>
        </CustomModal>
    )
}

export default CreateCategory