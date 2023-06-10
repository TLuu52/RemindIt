import { styled } from "@mui/system"

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
}));
function CustomInput({ placeholder }) {
    return (
        <StyledInput placeholder={placeholder}></StyledInput>
    )
}

export default CustomInput