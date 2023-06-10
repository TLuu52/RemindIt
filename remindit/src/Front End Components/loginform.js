import React, { useState } from "react";
import { styled } from '@mui/system';
import { Button, Input, TextField, useTheme } from "@mui/material";
import CustomInput from './Utility/CustomInput'
import CustomButton from "./Utility/CustomButton";
import CustomLine from "./Utility/CustomLine";
import CustomGoogleButton from "./Utility/CustomGoogleButton";
import Logo from "./Utility/Logo";

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
const SpanText = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline'
    }
}))

const LoginForm = () => {

    return (
        <Page>
            <TopCorner>
                <Logo />
            </TopCorner>
            <Cover>
                <Title>Log into your account</Title>
                <Group>
                    <CustomInput placeholder={'Email'} />
                    <CustomInput placeholder={'Password'} />
                </Group>
                <CustomButton text={'Log in'} color={1} />
                <CustomLine text={'Or Sign in With'} />
                <CustomGoogleButton />
                <BottomText>Don't have an account yet? <SpanText>Sign Up.</SpanText></BottomText>
            </Cover >
        </Page>
    )

}

export default LoginForm