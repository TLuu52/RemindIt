import { Button, Container, Switch, Typography, styled } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { BsCircleFill, BsPlus } from "react-icons/bs"
import CreateCategory from "./CreateCategory"
import { UserContext } from "../../App"
import { doc, getDoc } from "firebase/firestore"
import { firestore } from "../../firebase"

const CustomContainer = styled(Container)(({ theme }) => ({
    background: theme.palette.primary.border,
    padding: '10px',
    borderRadius: '16px',
}))
const Top = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.primary.contrastText,
    width: '100%',
    '& svg path': {
        strokeWidth: '1px',
        color: theme.palette.primary.contrastText
    }
}))
const List = styled('div')({
    marginTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
})
const ListItem = styled('div')({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: "center"
})
const ItemTitle = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '18px'
})

function EventFilter() {
    const [open, setOpen] = useState(false)
    const { user } = useContext(UserContext)
    const [categories, setCategories] = useState(null);
    const handleClose = () => setOpen(false)

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
        setTimeout(() => {
            if (user.currentUser && categories === null) {
                getCategories()
            }
        }, 400)
    })
    console.log(categories)

    return (
        <CustomContainer>
            <Top>
                <Typography variant="h6">Events</Typography>
                <Button sx={{ borderRadius: '50%', height: 'fit-content', width: 'fit-content', padding: '0', minWidth: 'auto' }} onClick={() => setOpen(true)}>
                    <BsPlus size={28} />
                </Button>
            </Top>
            <hr />
            <List>
                {categories && categories.map(category => (
                    <ListItem key={category.id}>
                        <ItemTitle>
                            <BsCircleFill size={14} color={category.color} />
                            <Typography variant="h6">{category.name}</Typography>
                        </ItemTitle>
                        <Switch />
                    </ListItem>
                ))}
            </List>
            <CreateCategory open={open} handleClose={handleClose} />
        </CustomContainer>
    )
}

export default EventFilter