import Header from './Utility/Header';
import { Box, Typography, styled } from '@mui/material';
import reminderImage from '../Icons/reminder.png';
import { Link } from 'react-router-dom';


const Page = styled('div')({
  padding: '20px',
  width: '100%',
  height: '100%',
  overflow: 'auto',
});

const Main = styled('div')({
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const Content = styled('div')(({ theme }) => ({
  maxWidth: '800px',
  textAlign: 'center',
}));

const BottomSection = styled('div')(({ theme }) => ({
  marginTop: '40px',
  padding: '20px',
  background: theme.palette.primary.border,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));


const AboutUs = () => {
  return (
    <Page>
      <Header absolute={true} />
      <Main>
        <Content>
          <img src={reminderImage} alt="Reminder" style={{ width: '50%', marginTop: '20px' }} />
          <Typography variant="h4" sx={{ marginBottom: '20px' }}>
            About Us
          </Typography>
          <Typography variant="body1">
            We are a reminder website dedicated to helping you stay organized and never miss an important task or event again. Our mission is to provide a simple and efficient platform that allows you to set reminders for various aspects of your life, such as appointments, deadlines, birthdays, and more.
          </Typography>
          <Typography variant="body1">
            With our intuitive interface and customizable reminder settings, you can easily create and manage reminders that suit your specific needs. Whether you prefer email notifications, push notifications on your mobile device, or both, our website has you covered.
          </Typography>
          <Typography variant="body1">
            We understand the value of time and the importance of staying on top of your commitments. That's why we built this website—to empower you with the tools you need to stay organized, reduce stress, and make the most out of every day.
          </Typography>
        </Content>
      </Main>
      <BottomSection>
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Typography variant="h5">
            <Link to="/dashboard">Dashboard</Link>
          </Typography>
          <Typography variant="h5">
            <Link to="/contact">Contact Us</Link>
          </Typography>
        </Box>
        <Typography variant="body1">@remindit 2023</Typography>
      </BottomSection>
    </Page>
  );
};

export default AboutUs;