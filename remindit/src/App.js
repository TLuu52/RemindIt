import LoginForm from "./Front End Components/loginform"; // Importing the LoginForm component
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importing the createTheme and ThemeProvider functions from MUI
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Importing Routing from react-routere-dom
import SignUp from "./Front End Components/SignUp"; // Importing SignUp component
import ProfileSettings from "./Front End Components/ProfileSettings";// Importing ProfileSettings component
import Dashboard from "./Front End Components/Dashboard";// Importing Dashboard component



// Creating a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4BCFFA",
      light: "#6B8594",
      dark: "#263238",
      contrastText: "#fff",
      border: '#37474F'
    },
  },
  typography: {
    allVariants: {
      color: '#fff'
    }
  }
});

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/profile',
    element: <ProfileSettings />
  },
  {
    path: '/',
    element: <Dashboard />
  }
])

//App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* REMINDER TO REDIRECT IF USER IS NOT LOGGED IN */}
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

// Exporting the App component
export default App;
