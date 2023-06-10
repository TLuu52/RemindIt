import { styled } from "@mui/material"
import { FcGoogle } from 'react-icons/fc'

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
function CustomGoogleButton() {

    return (
        <StyledButton>
            <FcGoogle size={'24px'} />
            Google
        </StyledButton>
    )
}

export default CustomGoogleButton