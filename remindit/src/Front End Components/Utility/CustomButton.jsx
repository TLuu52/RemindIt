import { styled } from "@mui/material"

const StyledButtonMain = styled('button')(({ theme }) => ({
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
    margin: 'auto'
}));
const StyledButtonSecondary = styled('button')(({ theme }) => ({
    cursor: 'pointer',
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    padding: '19px 10px',
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none',
    border: 'none',
    borderRadius: '6px',
    width: '500px',
    margin: 'auto'
}));

function CustomButton({ text, color }) {
    return (
        <>
            {color === 1 ? <StyledButtonMain>{text}</StyledButtonMain> : <StyledButtonSecondary>{text}</StyledButtonSecondary>
            }
        </>
    )
}

export default CustomButton