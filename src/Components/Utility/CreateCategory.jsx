import { Box, InputLabel, Modal, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react'
import CustomButton from './CustomButton';
import styled from '@emotion/styled';
import CustomInput from './CustomInput';
import { useTheme } from '@emotion/react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { UserContext } from '../../App';
import { BsCircleFill } from 'react-icons/bs';

const CustomModal = styled(Modal)(({
    display: 'grid',
    placeItems: 'center'
}));

const ColorPicker = styled('input')(({
    width: "50px",
    height: "50px",
    outline: 'none',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
}))

const Flex = styled('div')(({
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

const CategoryItem = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '4px',
    background: theme.palette.primary.dark,
    marginBottom: '4px',
    '& div': {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    }
}))

function CreateCategory({ open, handleClose, categories, setCategories }) {
    const theme = useTheme();

    const [color, setColor] = useState(theme.palette.primary.main);
    const [categoryName, setCategoryName] = useState('');
    const { user, setOpen, setMessage } = useContext(UserContext)

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
        // DELETE ME
        console.log("GETTING CATS")
        if (user.currentUser && categories === null) {
            setTimeout(() => {
                getCategories();
            }, 400);
        }
    }, [user.currentUser, categories, getCategories]);

    const onSubmit = async () => {
        const newCategory = { name: categoryName, color: color };
        const updatedCategories = categories ? [...categories, newCategory] : [newCategory];
        setCategories(updatedCategories);

        const categoryDocRef = doc(firestore, 'categories', user.currentUser.uid);
        const docSnap = await getDoc(categoryDocRef);

        if (docSnap.exists()) {
            await updateDoc(categoryDocRef, {
                categories: updatedCategories
            }).then(() => {
                setMessage({ text: 'Category Created!', severity: 'success' })
                setOpen(true)
            }).catch(() => {
                setMessage({ text: 'Error creating category!', severity: 'Error' })
                setOpen(true)
            });
        } else {
            await setDoc(categoryDocRef, {
                categories: updatedCategories
            }).then(() => {
                setMessage({ text: 'Category Created!', severity: 'success' })
                setOpen(true)
            }).catch(() => {
                setMessage({ text: 'Error creating category!', severity: 'Error' })
                setOpen(true)
            });
        }

        getCategories();
        handleClose();
    };

    const onDeleteCategory = async (category) => {
        const updatedCategories = categories.filter((cat) => cat !== category);
        setCategories(updatedCategories);

        const categoryDocRef = doc(firestore, 'categories', user.currentUser.uid);
        await updateDoc(categoryDocRef, {
            categories: updatedCategories
        }).then(() => {
            setMessage({ text: 'Category Deleted!', severity: 'success' })
            setOpen(true)
        }).catch(() => {
            setMessage({ text: 'Error deleting category!', severity: 'Error' })
            setOpen(true)
        });

        getCategories();
    };

    return (
        <CustomModal
            open={open}
            onClose={handleClose}
            aria-labelledby="CustomModal-modal-title"
            aria-describedby="modal-modal-description" >
            <Box sx={{ display: 'flex', flexDirection: 'column', background: theme.palette.primary.border, padding: '20px', borderRadius: '8px', width: '50%', gap: '20px' }}>
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
                <Typography variant='h4'>Categories</Typography>
                {categories &&
                    categories.map((category) => (
                        <CategoryItem key={category.name}>
                            <div>
                                <Typography variant='body1'>{category.name}</Typography> <BsCircleFill color={category.color} />
                            </div>
                            <CustomButton
                                color={2}
                                text="Delete"
                                size="s"
                                onClick={() => onDeleteCategory(category)}
                            />
                        </CategoryItem>
                    ))}
            </Box>
        </CustomModal >
    )
}

export default CreateCategory