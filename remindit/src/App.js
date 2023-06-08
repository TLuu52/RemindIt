import LoginForm from "./Front End Components/loginform";
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-brandBorderColor': '#fff',
          '--TextField-brandBorderHoverColor': '#fff',
          '--TextField-brandBorderFocusedColor': '#fff',
        }
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        borderColor: '#fff',
      },
    }
  }
});


function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="page">
        <LoginForm />
      </div>
    </ThemeProvider>
  );
}

export default App;
