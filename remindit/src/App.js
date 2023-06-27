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
import React, { useState } from 'react';
import Dashboard from './Components/Dashboard';




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
  const value = { user, setUser };
  return (
    <UserContext.Provider value={value}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          {/* REMINDER TO REDIRECT IF USER IS NOT LOGGED IN */}
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalizationProvider>
    </UserContext.Provider>
  );
}

// Exporting the App component
export default App;
