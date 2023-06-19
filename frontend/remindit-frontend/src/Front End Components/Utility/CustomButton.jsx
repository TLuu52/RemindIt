import { styled, useTheme } from "@mui/material" // Importing the 'styled' function from the MUI library
import { useNavigate } from "react-router-dom";

// Defining a styled component for the main button
const StyledButton = styled('button')(({ theme }) => ({
    cursor: 'pointer',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '19px 10px',
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none',
    border: 'none',
    borderRadius: '6px',
    width: '500px',
    '&:hover': {
        opacity: .6,
        transition: 'all .3s ease'
    }
}));
// CustomButton component
function CustomButton({ text, color, size, link, type, onClick }) {
    const theme = useTheme()
    const navigate = useNavigate();

    return (
        <>
            {size === 's' ?
                <StyledButton type={type} style={{ background: color === 1 ? theme.palette.primary.main : theme.palette.primary.light, fontSize: '14px', width: '120px', padding: '12px 0px', borderRadiu: '3px' }}
                    onClick={link ? () => navigate(link) : onClick}>{text}</StyledButton>
                :
                <StyledButton style={{ background: color === 1 ? theme.palette.primary.main : theme.palette.primary.light, margin: 'auto' }} onClick={link ? () => navigate(link) : onClick}>{text}</StyledButton>
            }
        </>
    )
}



// Exporting the CustomButton component
export default CustomButton