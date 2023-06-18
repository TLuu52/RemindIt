import { Typography, styled } from "@mui/material"
import Logo from "./Utility/Logo"
import Header from "./Utility/Header";
import CustomButton from "./Utility/CustomButton";
import CustomInput from "./Utility/CustomInput";
import ProfileIcon from "./Utility/ProfileIcon";
import { BsUpload } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { UserContext } from "../App";
import { updateProfile } from "firebase/auth";

const TopCorner = styled('div')({
    position: 'relative',
    top: '0',
    left: '0',
    width: '200px',
    padding: '20px'
})
const Title = styled('h1')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    fontWeight: '600',
    padding: '45px 0px 0px',
    margin: 'auto'
}));
const Page = styled('div')({
    padding: '20px',
    height: '100vh',
    overflowY: 'auto'
})
const Row = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1500px',
    padding: '20px 0px'
})
const End = styled('div')({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'end',
    gap: '10px',
    paddingTop: '20px'
})
const CustomHr = styled('hr')({
    margin: '30px 0px',
})
const Section = styled('div')({
    width: '500px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
})
const CustomLabel = styled('label')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    '& input[type="file"]': {
        display: 'none'
    },
    '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
        opacity: .6,
        transition: 'all .3s ease'
    },
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.primary.light}`,
    gap: '10px',
    padding: '20px 10px',
    borderRadius: '8px',
    background: theme.palette.primary.main
}))
function ProfileSettings() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('default');
    const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        // Gather credentials
        console.log(user)
        setTimeout(() => {
            if (user.currentUser) {
                setFirstName(user.currentUser.displayName.split(' ')[0]);
                setLastName(user.currentUser.displayName.split(' ')[1]);
                setEmail(user.currentUser.email);
                setPicture(user.currentUser.photoURL || 'default');
            } else {
                console.log(user.currentUser)
            }
        }, 300)
    }, []);
    const newPicture = (e) => {
        console.log('NEED TO ADD NEW PIC FUNCTIONALITY, ALSO BIO FUNCTIONALITY')
        // setPicture(e.target.value)
    }
    const submit = async (e) => {
        e.preventDefault()
        try {
            console.log(auth.currentUser)
            await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}`, email: email });
            setUser(auth)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Page>
            <form onSubmit={(e) => submit(e)}>
                <Header />
                <Title>Profile Settings</Title>
                <CustomHr />
                <Row>
                    <Typography variant="h5" >First Name</Typography>
                    <CustomInput placeholder="First Name" size={'s'} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Row>
                <Row>
                    <Typography variant="h5" >Last Name</Typography>
                    <CustomInput placeholder="Last Name" size={'s'} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Row>
                <CustomHr />
                <Row>
                    <Typography variant="h5" >Email</Typography>
                    <CustomInput placeholder="Email" size={'s'} value={email} onChange={(e) => setEmail(e.target.value)} />
                </Row>

                <CustomHr />
                <Row>
                    <Typography variant="h5" >Profile Picture</Typography>
                    <Section>
                        <ProfileIcon size={'l'} img={picture} />
                        <CustomLabel>
                            <input type="file" accept="image/*" onChange={(e) => newPicture(e)} />
                            <BsUpload size={"20px"} />
                            Upload new Image
                        </CustomLabel>
                    </Section>
                </Row>
                <CustomHr />
                <Row>
                    <Typography variant="h5" sx={{ alignSelf: 'start' }} >Bio </Typography>
                    <CustomInput placeholder="Bio" size={'l'} />
                </Row>
                <CustomHr />
                <End>
                    <CustomButton text={'Cancel'} color={0} size={'s'} link={'/dashboard'} />
                    <CustomButton type={'submit'} text={'Save'} color={1} size={'s'} />
                </End>
            </form>
        </Page>

    )
}

export default ProfileSettings