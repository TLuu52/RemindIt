import { styled } from "@mui/system"

const StyledInput = styled('input')({
    outline: 'none',
    backgroundColor: 'transparent',
    border: '2px solid #6B8594',
    borderRadius: '12px',
    padding: '19px 22px',
    fontSize: '20px',
    width: '500px',
    margin: 'auto',
    color: 'rgb(255,255,255)',
    '::placeholder': {
        color: 'white',
        opacity: .6
    }
})
function CustomInput({ placeholder }) {
    return (
        <StyledInput placeholder={placeholder}></StyledInput>
    )
}

export default CustomInput