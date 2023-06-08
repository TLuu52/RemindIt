import { styled } from "@mui/material"

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

function CustomButton({ text, color }) {
    return (
        <>
            {color === 1 ? <StyledButtonMain>{text}</StyledButtonMain> : <StyledButtonSecondary>{text}</StyledButtonSecondary>
            }
        </>
    )
}

export default CustomButton