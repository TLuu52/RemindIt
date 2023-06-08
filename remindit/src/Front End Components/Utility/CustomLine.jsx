import { styled } from "@mui/material"

const StyledLine = styled('h1')({
    color: '#fefefe',
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
})

function CustomLine({ text }) {
    return (
        <StyledLine>{text}</StyledLine>
    )
}

export default CustomLine