import { styled } from "@mui/material" // Importing the 'styled' function from the MUI library
import { FcGoogle } from 'react-icons/fc' // Importing the 'FcGoogle' icon from the 'react-icons/fc' package

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

// Defining a styled component for the span element
const StyleSpan = styled('span')({
    fontSize: '40px'
})

// CustomGoogleButton component
function CustomGoogleButton() {

    return (
        <StyledButton>
            <FcGoogle size={'24px'} />
            Google
        </StyledButton>
    )
}

// Exporting the CustomGoogleButton component
export default CustomGoogleButton