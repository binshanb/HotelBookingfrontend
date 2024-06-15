import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between">
        <p className="text-sm text-center sm:text-left mb-4 sm:mb-0">
          &copy; {new Date().getFullYear()} Extreme Hotel. All rights reserved.
        </p>
        <ul className="flex flex-wrap justify-center sm:justify-end">
          <li className="px-2 py-1 sm:py-0">
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li className="px-2 py-1 sm:py-0">
            <Link to="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </li>
          <li className="px-2 py-1 sm:py-0">
            <Link to="/terms-conditions" className="hover:underline">
              Terms and Conditions
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

















// import React from 'react';
// import { styled } from '@mui/system';
// import { Grid, Typography, Link, IconButton, Box } from '@mui/material';
// import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';

// const StyledFooter = styled('footer')({
//   backgroundColor: '#222',
//   color: '#fff',
//   padding: '40px',
//   position: 'relative',
//   width: '100%',
//   bottom: 0,
// });

// const Footer = () => {
//   return (
//     <StyledFooter>
//       <Grid container spacing={4}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Typography variant="h6" gutterBottom>
//             Explore Our Hotel
//           </Typography>
//           <Link href="/categorylist" color="inherit" underline="hover" gutterBottom>
//             Rooms & Suites
//           </Link>
         
//         </Grid>
 
//       </Grid>

//       <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
//         <Box>
//           <IconButton href="https://www.facebook.com/your-facebook-page" target="_blank" rel="noopener noreferrer" color="primary">
//             <BsFacebook size={24} />
//           </IconButton>
//           <IconButton href="https://twitter.com/your-twitter-account" target="_blank" rel="noopener noreferrer">
//       <BsTwitter size={24} className="text-blue-700" />
//       </IconButton>
//       <IconButton href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer">
//       <BsLinkedin size={24} className="text-blue-700" />
//       </IconButton>
//       <IconButton href="https://www.instagram.com/your-instagram-account" target="_blank" rel="noopener noreferrer">
//       <BsInstagram size={24} className="text-blue-700" />
//       </IconButton>
   
//         </Box>
//         <Typography variant="body2" color="inherit">
//           &#169; {new Date().getFullYear()} Extreme Hotel. All rights reserved.
//         </Typography>
//         <Box>
//           <Link href="/about" color="inherit" sx={{ marginRight: '10px' }}>
//           About 
//           </Link>
//           </Box>
//           <Box>
//           <Link href="/contact" color="inherit" sx={{ marginRight: '10px' }}>
//           Contact 
//           </Link>
//           </Box>
//           <Box>
//           <Link href="privacy-policy" color="inherit" sx={{ marginRight: '10px' }}>
//           Privacy Policy
//           </Link>
//           </Box>
//           <Box>
//           <Link href="/terms-conditions" color="inherit" sx={{ marginRight: '10px' }}>
//           Terms and Conditions
//           </Link>
//           </Box>
     
//       </Box>
//     </StyledFooter>
//   );
// };

// export default Footer;
