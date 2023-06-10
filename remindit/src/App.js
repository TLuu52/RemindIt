import LoginForm from "./Front End Components/loginform";  // Importing the LoginForm component
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importing the createTheme and ThemeProvider functions from MUI

// Creating a custom theme
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-brandBorderColor': '#fff', // Customizing the brand border color
          '--TextField-brandBorderHoverColor': '#fff', // Customizing the brand border hover color
          '--TextField-brandBorderFocusedColor': '#fff', // Customizing the brand border focused color
        }
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        borderColor: '#fff', // Customizing the outlined input border color
      },
    }
  }
});

// App component
function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="page">
        <LoginForm />
      </div>
    </ThemeProvider>
  );
}

// Exporting the App component
export default App;
