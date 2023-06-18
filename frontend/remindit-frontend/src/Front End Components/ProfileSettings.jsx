import { Typography, styled } from "@mui/material"
import Logo from "./Utility/Logo"
import Header from "./Utility/Header";
import CustomButton from "./Utility/CustomButton";
import CustomInput from "./Utility/CustomInput";
import ProfileIcon from "./Utility/ProfileIcon";
import { BsUpload } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { auth, firestore, storage } from "../firebase";
import { UserContext } from "../App";
import { updateEmail, updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';



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

const MAX_BIO_LENGTH = 250;

function ProfileSettings() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('default');
    const { user, setUser } = useContext(UserContext)
    const [bio, setBio] = useState('');
    const [bioCharacterCount, setBioCharacterCount] = useState(0);
    const db = firestore;

    useEffect(() => {
        // Gather credentials
        console.log(user)
        setTimeout(() => {
            if (user.currentUser) {
                setFirstName(user.currentUser.displayName.split(' ')[0]);
                setLastName(user.currentUser.displayName.split(' ')[1]);
                setEmail(user.currentUser.email);
                setPicture(user.currentUser.photoURL || 'default');
                setBio(user.currentUser.bio || '');
            } else {
                console.log(user.currentUser)
            }
        }, 300)
    }, [user.currentUser]);

    const newPicture = async (e) => {
        const file = e.target.files[0];

        try {
            const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload progress: ${progress}%`);
            }, (error) => {
                console.log('Upload error:', error);
            }, async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log('File uploaded successfully:', downloadURL);

                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                    picture: downloadURL
                });

                setPicture(downloadURL); // Update the state with the new picture URL
            });
        } catch (error) {
            console.log('Error uploading file:', error);
        }
    };

    const updateFirestore = async (data) => {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, data);
    };

    const submit = async (e) => {
        e.preventDefault();

        const userId = auth.currentUser.uid; // Get the current user's ID
        const userRef = doc(db, "users", userId); // Create a document reference for the user

        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            bio: bio
        };

        await updateFirestore(userData);
    };

    const handleBioChange = (e) => {
        const newBio = e.target.value;
        if (newBio.length <= MAX_BIO_LENGTH) {
            setBio(newBio);
            setBioCharacterCount(newBio.length);
        }
    };

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
                    <CustomInput placeholder="Bio" size={'l'} value={bio} onChange={handleBioChange} maxLength={MAX_BIO_LENGTH} />
                    <Typography variant="h5" > {bioCharacterCount}/{MAX_BIO_LENGTH} characters </Typography>
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