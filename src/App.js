import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importing the createTheme and ThemeProvider functions from MUI
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Importing Routing from react-routere-dom
import LoginForm from "./Components/loginform"; // Importing the LoginForm component
import SignUp from "./Components/SignUp"; // Importing SignUp component
import ProfileSettings from "./Components/ProfileSettings";// Importing ProfileSettings component
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { auth } from './firebase';
import React, { useEffect, useState } from 'react';
import Dashboard from './Components/Dashboard';
import { Alert, Snackbar, Typography } from '@mui/material';
import Logo from './Components/Utility/Logo';




// Creating a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4BCFFA", // Main Light Blue color
      light: "#6B8594", // Foreground Color
      dark: "#263238", // Background Color
      contrastText: "#fff", // Text Color
      border: '#37474F', // Border color
    },
    secondary: {
      main: '#4d636e',
      dark: '#7a95a2',
      light: '#4BCFFA22',
      border: 'rgba(255,255,255,0.4)',
      contrastText: 'rgba(72, 209, 253,.2)'
    },
    custom: {
      main: '#fff',
      dark: '#fff',
      light: '#6B8594',
      contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: [
      'Montserrat'
    ],
    allVariants: {
      color: '#fff'
    },
    h5: {
      fontWeight: '300'
    }
  },
});

const router = createBrowserRouter([
  {
    path: '/', // Access login page manually with with this path, if user is logged in, otherwise redirect to /Dashboard
    element: <LoginForm />
  },
  {
    path: '/signup', // Access SignUp page manually with with this path
    element: <SignUp />
  },
  {
    path: '/profile', // Access Profile page manually with with this path
    element: <ProfileSettings />
  },
  {
    path: '/About', // Access Dashboard page manually with with this path
    element: <AboutUs />
  },
  {
    path: '/Contact', // Access Dashboard page manually with with this path
    element: <ContactUs />
  },
  {
    path: '/Dashboard', // Access Dashboard page manually with with this path
    element: <Dashboard />
  },

])

export const UserContext = React.createContext()

//App Component
function App() {
  const [user, setUser] = useState(auth)
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);

  const closeSnackbar = () => {
    setOpen(false)
    setTimeout(() => {
      setMessage(null)
    }, 1000)
  }
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const isMobile = width <= 768;

  if (isMobile) {
    return (
      <div style={{ overflow: 'hidden', height: '100%', width: '100%', display: 'grid', placeItems: 'center' }}>
        <div style={{ width: '85%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <Logo size='60%' />
          <Typography variant='h5'>Please use a Desktop or a Laptop to access this web application</Typography>
          <hr style={{ width: '100%' }} />
          <Typography variant='body1'>Mobile Application coming soon...</Typography>
        </div>
      </div>
    )
  }

  const value = { user, setUser, message, setMessage, open, setOpen, closeSnackbar };
  return (
    <UserContext.Provider value={value}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={3000} onClose={() => closeSnackbar()}>
            <Alert severity={message?.severity}>{message?.text}</Alert>
          </Snackbar>
          {/* REMINDER TO REDIRECT IF USER IS NOT LOGGED IN */}
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalizationProvider>
    </UserContext.Provider>
  );
}

// Exporting the App component
export default App;
