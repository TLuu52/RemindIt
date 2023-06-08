import React, { useState } from "react";
import { styled } from '@mui/system';
import { Button, Input, TextField, useTheme } from "@mui/material";
import CustomInput from './Utility/CustomInput'
import CustomButton from "./Utility/CustomButton";
import CustomLine from "./Utility/CustomLine";
import CustomGoogleButton from "./Utility/CustomGoogleButton";
import Logo from "./Utility/Logo";

const Title = styled('h1')({
    color: 'white',
    fontWeight: '600',
    paddingBottom: '45px',
    margin: 'auto'
});
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

const LoginForm = () => {
    const theme = useTheme();
    const [popupStyle, showPopup] = useState("hide")

    const popup = () => {
        showPopup("login-popup")
        setTimeout(() => showPopup("hide"), 3000)
    }

    return (
        <Page>
            <TopCorner>
                <Logo />
            </TopCorner>
            <Cover>
                <Title>Log into your account</Title>
                <Group>
                    <CustomInput placeholder={'Email'}></CustomInput>
                    <CustomInput placeholder={'Password'}></CustomInput>
                </Group>
                <CustomButton text={'Log in'} color={1}>Log in</CustomButton>
                <CustomLine text={'Or Sign in With'}></CustomLine>
                <CustomGoogleButton></CustomGoogleButton>
                <p style={{ color: '#fefefe', fontWeight: '200', fontSize: '14px', margin: '20px auto' }}>Don't have an account yet? <span style={{ color: "#4BCFFA", cursor: 'pointer' }}>Sign Up.</span></p>
            </Cover >
        </Page>
    )

}

export default LoginForm