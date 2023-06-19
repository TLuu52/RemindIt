import { styled } from "@mui/material" // Importing the 'styled' function from the MUI library
import { FcGoogle } from 'react-icons/fc' // Importing the 'FcGoogle' icon from the 'react-icons/fc' package
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

// Defining a styled component for the button
const StyledButton = styled('button')(({ theme }) => ({
  width: '130px',
  height: '50px',
  borderRadius: '5px',
  border: `1px solid ${theme.palette.primary.contrastText}`,
  backgroundColor: "transparent",
  color: '#fefefe',
  fontSize: '18px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  fontWeight: '200',
  cursor: 'pointer',
  margin: 'auto',
  marginTop: '20px',
}))

const CustomGoogleButton = () => {

  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // Handle successful sign-in
        console.log(result.user);
        const userDocRef = doc(firestore, 'users', result.user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            firstName: result.user.displayName.split(' ')[0],
            lastName: result.user.displayName.split(' ')[1],
            email: result.user.email,
            picture: result.user.photoURL, // Assuming you have the URL of the profile picture
            bio: '', // Add the user's bio here
          });
        }
        navigate('/dashboard');
      })
      .catch((error) => {
        // Handle sign-in error
        console.log(error);
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  };

  return (
    <StyledButton onClick={handleGoogleSignIn} disabled={isSigningIn}>
      <FcGoogle size={'24px'} />
      Google
    </StyledButton>
  );

};

// Exporting the CustomGoogleButton component
export default CustomGoogleButton