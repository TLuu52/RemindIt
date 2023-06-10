import { styled } from "@mui/material" // Importing the 'styled' function from the MUI library

// Defining a styled component for the main button
const StyledButtonMain = styled('button')({
    cursor: 'pointer',
    background: '#4BCFFA',
    color: 'white',
    padding: '19px 10px',
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none',
    border: 'none',
    borderRadius: '6px',
    width: '500px',
    margin: 'auto'
})

// Defining a styled component for the secondary button
const StyledButtonSecondary = styled('button')({
    cursor: 'pointer',
    background: '#6B8594',
    color: 'white',
    padding: '20px 10px',
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none',
    border: 'none',
    borderRadius: '6px',
    width: '60%',
    margin: 'auto'
})

// CustomButton component
function CustomButton({ text, color }) {
    return (
        <>
            {color === 1 ? <StyledButtonMain>{text}</StyledButtonMain> : <StyledButtonSecondary>{text}</StyledButtonSecondary>
            }
        </>
    )
}

// Exporting the CustomButton component
export default CustomButton