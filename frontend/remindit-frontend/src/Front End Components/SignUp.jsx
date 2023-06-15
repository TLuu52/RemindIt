import { styled } from '@mui/system';
import CustomInput from './Utility/CustomInput' // Importing the CustomInput component
import CustomButton from "./Utility/CustomButton"; // Importing the CustomButton component
import Logo from "./Utility/Logo"; // Importing the Logo component
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

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

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log(userCredential);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    

    return (
        <form onSubmit = {signUp}>
        <Page>
            <TopCorner>
                <Logo />
            </TopCorner>
            <Cover>
                <Title>Create a RemindIt Account</Title>
                <Group>
                    <CustomInput placeholder={'First Name'} size={'m'} style={{ margin: 'auto' }} />
                    <CustomInput placeholder={'Last Name'} size={'m'} style={{ margin: 'auto' }} />
                    <CustomInput placeholder={'Email'} size={'m'} style={{ margin: 'auto' }} value = {email} onChange ={(e) => setEmail(e.target.value)}/>
                    <CustomInput placeholder={'Password'} size={'m'} style={{ margin: 'auto' }} type={'password'} value = {password} onChange ={(e) => setPassword(e.target.value)}/>
                </Group>
                <CustomButton text={'Create Account'} color={1} />
                <BottomText>Already have an account? <CustomLink to='/'>Log in.</CustomLink></BottomText>
            </Cover >
        </Page>
        </form>
    )
}

export default SignUp