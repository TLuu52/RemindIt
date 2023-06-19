import { styled } from '@mui/system';
import CustomInput from './Utility/CustomInput' // Importing the CustomInput component
import CustomButton from "./Utility/CustomButton"; // Importing the CustomButton component
import Logo from "./Utility/Logo"; // Importing the Logo component
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { UserContext } from '../App';
import { doc, setDoc } from 'firebase/firestore';

const Title = styled('h1')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    fontWeight: '600',
    paddingBottom: '45px',
    margin: 'auto'
}));
const Cover = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    minWidth: '500px',
    justifyContent: 'center'
})
const Page = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: "100vh",
    width: '100vw'
})
const Group = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    paddingBottom: '34px'
})
const TopCorner = styled('div')({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '260px',
    padding: '20px'
})
const BottomText = styled('p')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    fontWeight: '200',
    fontSize: '14px',
    margin: '20px auto'
}))
const CustomLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline'
    }
}))

const SignUp = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext)

    const signUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` });
            const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
            await setDoc(userDocRef, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                picture: 'default', // Assuming you have the URL of the profile picture
                bio: '', // Add the user's bio here
            });
            await auth.signOut(); // Sign out the user
            navigate('/'); // Redirect to login page
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            if (auth.currentUser) {
                setUser(auth)
                navigate('/dashboard')
            }
        }, 200)
    }, [])


    return (
        <form onSubmit={signUp}>
            <Page>
                <TopCorner>
                    <Logo size={'250px'} />
                </TopCorner>
                <Cover>
                    <Title>Create a RemindIt Account</Title>
                    <Group>
                        <CustomInput placeholder={'First Name'} size={'m'} style={{ margin: 'auto' }} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <CustomInput placeholder={'Last Name'} size={'m'} style={{ margin: 'auto' }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <CustomInput placeholder={'Email'} size={'m'} style={{ margin: 'auto' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <CustomInput placeholder={'Password'} size={'m'} style={{ margin: 'auto' }} type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Group>
                    <CustomButton text={'Create Account'} color={1} type={'submit'} />
                    <BottomText>Already have an account? <CustomLink to='/'>Log in.</CustomLink></BottomText>
                </Cover >
            </Page>
        </form>
    )
}

export default SignUp