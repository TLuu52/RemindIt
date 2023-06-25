import LogoSrc from '../../Icons/logo.png' // Importing the logo image file

// Logo component
function Logo({ size }) {
    return (
        <img src={LogoSrc} alt="RemindIt Logo" style={{ width: `${size}` }} />
    )
}

// Exporting the Logo component
export default Logo