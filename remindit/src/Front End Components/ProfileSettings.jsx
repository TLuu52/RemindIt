import { Typography, styled, useTheme } from "@mui/material"
import Logo from "./Utility/Logo"
import Header from "./Utility/Header";
import CustomButton from "./Utility/CustomButton";
import CustomInput from "./Utility/CustomInput";

const TopCorner = styled('div')({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '200px',
    padding: '20px'
})
const Title = styled('h1')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    fontWeight: '600',
    paddingBottom: '45px',
    margin: 'auto'
}));
const Page = styled('div')({
    padding: '20px'
})

const Row = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
})

function ProfileSettings() {
    const theme = useTheme();

    return (
        <Page>
            <TopCorner><Logo /></TopCorner>
            <Header />
            <Title>Profile Settings</Title>
            <hr />
            <Row>
                <Typography variant="h5" >First Name</Typography>
                <CustomInput placeholder="First Name" size={'s'} />
            </Row>
            <Row>
                <Typography variant="h5" >Last Name</Typography>
                <CustomInput placeholder="Last Name" size={'s'} />
            </Row>
            <hr />
            <Row>
                <Typography variant="h5" >Email</Typography>
                <CustomInput placeholder="Email" size={'s'} />
            </Row>

            <hr />
            <Typography variant="h5" >Profile Picture</Typography>
            <hr />
            <Row>
                <Typography variant="h5" >Bio </Typography>
                <CustomInput placeholder="Bio" size={'l'} />
            </Row>
            <hr />
            <CustomButton text={'Cancel'} color={0} size={'s'} />
            <CustomButton text={'Save'} color={1} size={'s'} />

        </Page>

    )
}

export default ProfileSettings