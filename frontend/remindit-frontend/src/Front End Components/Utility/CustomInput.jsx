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
const StyledTextArea = styled('textArea')(({ theme }) => ({
    outline: 'none',
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.primary.light}`,
    width: '500px',
    color: theme.palette.primary.contrastText,
    '::placeholder': {
        color: theme.palette.primary.contrastText,
        opacity: .6
    },
    height: '200px',
    fontSize: '14px',
    padding: '10px',
    borderRadius: '8px'
}))

// CustomInput component
function CustomInput({ placeholder, size, type = 'text' }) {
    console.log(placeholder, size)
    return (
        <>
            {size == 's' ? <StyledInput placeholder={placeholder} style={{ margin: '0', fontSize: '16px', padding: '10px 22px', borderRadius: '20px' }} type={type} />
                : size == 'm' ?
                    <StyledInput placeholder={placeholder} type={type} />
                    : <StyledTextArea placeholder={placeholder} />
            }
        </>
    )
}

// Exporting the CustomInput component
export default CustomInput