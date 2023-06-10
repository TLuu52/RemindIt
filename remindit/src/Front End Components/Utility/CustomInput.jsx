import { styled } from "@mui/system" // Importing the 'styled' function from the MUI system

// Defining a styled component for the input element
const StyledInput = styled('input')(({ theme }) => ({
    outline: 'none',
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.primary.light}`,
    borderRadius: '12px',
    padding: '19px 22px',
    fontSize: '20px',
    width: '500px',
    margin: 'auto',
    color: theme.palette.primary.contrastText,
    '::placeholder': {
        color: theme.palette.primary.contrastText,
        opacity: .6
    }
}))

// CustomInput component
function CustomInput({ placeholder }) {
    return (
        <StyledInput placeholder={placeholder}></StyledInput>
    )
}

// Exporting the CustomInput component
export default CustomInput