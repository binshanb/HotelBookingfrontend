import React from 'react';
import { styled } from '@mui/system';
import { Grid, Typography, Link, IconButton, Box } from '@mui/material';
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';

const StyledFooter = styled('footer')({
  backgroundColor: '#222',
  color: '#fff',
  padding: '40px',
});

const Footer = () => {
  return (
    <StyledFooter>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Explore Our Hotel
          </Typography>
          <Link href="/rooms" color="inherit" underline="hover" gutterBottom>
            Rooms & Suites
          </Link>
          {/* Add more links for dining options, amenities, etc. */}
        </Grid>
        {/* Add more grid items for other sections of the footer */}
        {/* ... */}
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <IconButton href="https://www.facebook.com/your-facebook-page" target="_blank" rel="noopener noreferrer" color="primary">
            <BsFacebook size={24} />
          </IconButton>
          <IconButton href="https://twitter.com/your-twitter-account" target="_blank" rel="noopener noreferrer">
      <BsTwitter size={24} className="text-blue-700" />
      </IconButton>
      <IconButton href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer">
      <BsLinkedin size={24} className="text-blue-700" />
      </IconButton>
      <IconButton href="https://www.instagram.com/your-instagram-account" target="_blank" rel="noopener noreferrer">
      <BsInstagram size={24} className="text-blue-700" />
      </IconButton>
   
          {/* Add more social media icons */}
        </Box>
        <Typography variant="body2" color="inherit">
          &#169; {new Date().getFullYear()} Luxury Hotel. All rights reserved.
        </Typography>
        <Box>
          <Link href="/about" color="inherit" sx={{ marginRight: '10px' }}>
          About 
          </Link>
          </Box>
          <Box>
          <Link href="/contact" color="inherit" sx={{ marginRight: '10px' }}>
          Contact 
          </Link>
          </Box>
          <Box>
          <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
          Privacy Policy
          </Link>
          </Box>
          <Box>
          <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
          Terms and Conditions
          </Link>
          </Box>
     
      </Box>
    </StyledFooter>
  );
};

export default Footer;
