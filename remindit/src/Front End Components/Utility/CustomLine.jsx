import { styled } from "@mui/material" // Importing the 'styled' function from the MUI library

// Defining a styled component for the line
const StyledLine = styled('h1')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    fontWeight: '200',
    fontSize: '16px',
    overflow: 'hidden',
    width: '100%',
    marginTop: '40px',
    textAlign: 'center',
    ':before, :after': {
        backgroundColor: '#fefefe',
        content: '""',
        display: 'inline-block',
        height: '1px',
        position: ' relative',
        verticalAlign: 'middle',
        width: '50%'
    },
    ':before': {
        right: '20px',
        marginLeft: '-50%'
    },
    ':after': {
        left: '20px',
        marginRight: '-50%'
    }
}))

// CustomLine component
function CustomLine({ text }) {
    return (
        <StyledLine>{text}</StyledLine>
    )
}

// Exporting the CustomLine component
export default CustomLine