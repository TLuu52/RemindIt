import LogoSrc from '../../Icons/logo.png' // Importing the logo image file

// Logo component
function Logo() {
    return (
        <img src={LogoSrc} alt="RemindIt Logo" style={{ width: '100%' }} />
    )
}

// Exporting the Logo component
export default Logo