import Header from './Utility/Header';
import { Box, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import ContactUs from './ContactUs';


const Page = styled('div')({
  padding: '20px',
  width: '100%',
  height: '100%',
  overflow: 'auto',
});

const Main = styled('div')({
  display: 'flex',
  height: '100%',
  gap: '20px',
});

const Left = styled('div')(({ theme }) => ({
  width: '25%',
  maxWidth: '500px',
  minWidth: '350px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'top',
  gap: '50px',
  alignItems: 'center',
  paddingTop: '40px',
}));

const Right = styled('div')(({ theme }) => ({
  marginTop: '40px',
  padding: '20px',
  flexGrow: '1',
  height: '90%',
  borderRadius: '16px',
  background: theme.palette.primary.border,
  position: 'relative',
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
      <Header />
      <Main>
        <Left>
          {/* Content for the About Us page */}
        </Left>
        <Right>
          {/* Content for the About Us page */}
        </Right>
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