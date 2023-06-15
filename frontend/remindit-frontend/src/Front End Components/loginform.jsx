import { styled } from '@mui/system';
import CustomInput from './Utility/CustomInput' // Importing the CustomInput component
import CustomButton from "./Utility/CustomButton"; // Importing the CustomButton component
import CustomLine from "./Utility/CustomLine"; // Importing the CustomLine component
import CustomGoogleButton from "./Utility/CustomGoogleButton"; // Importing the CustomGoogleButton component
import { Link } from "react-router-dom";
import Logo from "./Utility/Logo"; // Importing the Logo component
import React, {useState} from "react";
import { auth} from "../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';

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


const LoginForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginForm = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {console.log(userCredential)})
        .catch((error) => {console.log(error)} );
    }
    
    return (
        <form onSubmit={loginForm}>
        <Page>
            <TopCorner>
                <Logo />
            </TopCorner>
            <Cover>
                <Title>Log into your account</Title>
                <Group>
                    <CustomInput placeholder={'Email'} size={'m'} style={{ margin: 'auto' }} value = {email} onChange ={(e) => setEmail(e.target.value)}/>
                    <CustomInput placeholder={'Password'} size={'m'} style={{ margin: 'auto' }} type='password' value = {password} onChange ={(e) => setPassword(e.target.value)}/>
                </Group>
                <CustomButton text={'Log in'} color={1} />
                <CustomLine text={'Or Sign in With'} />
                <CustomGoogleButton />
                <BottomText>Don't have an account yet? <CustomLink to='/signup'>Sign Up.</CustomLink></BottomText>
            </Cover >
        </Page>
        </form>
    )

}

// Exporting the LoginForm component
export default LoginForm