import LoginForm from "./Front End Components/loginform";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./Front End Components/SignUp";
import ProfileSettings from "./Front End Components/ProfileSettings";
import Dashboard from "./Front End Components/Dashboard";



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


function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* REMINDER TO REDIRECT IF USER IS NOT LOGGED IN */}
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
