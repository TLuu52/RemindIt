import LogoSrc from '../../Icons/logo.png' // Importing the logo image file

// Logo component
function Logo({ size, onClick = () => { } }) {
    return (
        <img src={LogoSrc} alt="RemindIt Logo" style={{ width: `${size}`, cursor: 'pointer' }} onClick={onClick} />
    )
}

// Exporting the Logo component
export default Logo