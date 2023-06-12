import { Typography, styled, useTheme } from "@mui/material"
import Logo from "./Utility/Logo"
import Header from "./Utility/Header";
import CustomButton from "./Utility/CustomButton";
import CustomInput from "./Utility/CustomInput";
import ProfileIcon from "./Utility/ProfileIcon";
import { BsUpload } from "react-icons/bs";

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
    padding: '45px 0px 0px',
    margin: 'auto'
}));
const Page = styled('div')({
    padding: '20px'
})
const Row = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '75%',
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
    const theme = useTheme();

    return (
        <Page>
            <TopCorner><Logo /></TopCorner>
            <Header />
            <Title>Profile Settings</Title>
            <CustomHr />
            <Row>
                <Typography variant="h5" >First Name</Typography>
                <CustomInput placeholder="First Name" size={'s'} />
            </Row>
            <Row>
                <Typography variant="h5" >Last Name</Typography>
                <CustomInput placeholder="Last Name" size={'s'} />
            </Row>
            <CustomHr />
            <Row>
                <Typography variant="h5" >Email</Typography>
                <CustomInput placeholder="Email" size={'s'} />
            </Row>

            <CustomHr />
            <Row>
                <Typography variant="h5" >Profile Picture</Typography>
                <Section>
                    <ProfileIcon size={'l'} />
                    <CustomLabel>
                        <input type="file" accept="image/*" />
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
                <CustomButton text={'Cancel'} color={0} size={'s'} />
                <CustomButton text={'Save'} color={1} size={'s'} />
            </End>

        </Page>

    )
}

export default ProfileSettings