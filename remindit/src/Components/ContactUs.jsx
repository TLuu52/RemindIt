import { useState } from 'react';
import { Box, Button, TextField, Typography, styled, Snackbar } from '@mui/material';
import Header from './Utility/Header';
import { Link } from 'react-router-dom';

const Page = styled('div')({
    padding: '20px',
    width: '100%',
    height: '100%',
    overflow: 'auto',
});

const Content = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
}));

const ContactForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [issueTitle, setIssueTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic for handling form submission goes here
        console.log('Form submitted!');
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Issue Title:', issueTitle);
        console.log('Description:', description);
        // Clear form fields
        setFirstName('');
        setLastName('');
        setIssueTitle('');
        setDescription('');
        setIsSubmitted(true);
    };

    const handleCancel = () => {
        // Logic for handling form cancellation goes here
        // Clear form fields
        setFirstName('');
        setLastName('');
        setIssueTitle('');
        setDescription('');
    };

    const handleCloseNotification = () => {
        setIsSubmitted(false);
    };

    return (
        <Box sx={{ marginTop: '20px', width: '100%', maxWidth: '400px' }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Issue Title"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button variant="contained" type="submit" sx={{ marginRight: '10px' }}>
                        Submit
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Box>
            </form>
            <Snackbar
                open={isSubmitted}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                message="Form submitted successfully!"
            />
        </Box>
    );
};

const ContactUs = () => {
    return (
        <Page>
            <Header />
            <Content>
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                    Contact Us
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                    We value your feedback and are always here to assist you. Please feel free to reach out to us using the following methods:
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                    Email: <a href="mailto:reminditsup@gmail.com">reminditsup@gmail.com</a>
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                    Phone: <a href="tel:+11234567890">+1 123 456 7890</a>
                </Typography>
                <Typography variant="body1">
                    You can also visit our <Link to="/about">About Us</Link> page to learn more about our team and mission.
                </Typography>

                <Typography variant="h5" sx={{ marginTop: '40px' }}>
                    Contact Form
                </Typography>
                <ContactForm />
            </Content>
            <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                <Typography variant="h5">
                    <Link to="/dashboard">Dashboard</Link>
                </Typography>
                <Typography variant="h5">
                    <Link to="/about">About Us</Link>
                </Typography>
            </Box>
            <Typography variant="body1">@remindit 2023</Typography>
        </Page>
    );
};

export default ContactUs;