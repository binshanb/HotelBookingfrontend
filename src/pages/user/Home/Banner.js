import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const images = [
  'images/hotel4.jpg',
  'images/hotel5.jpg',
  'images/hotel6.jpg',
  // Add more image URLs as needed
];

const ImageCarousel = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className="banner">
      <Carousel autoPlay infiniteLoop showStatus={false} showThumbs={false}>
        {images.map((image, index) => (
          <Box key={index} height={isSmallScreen ? '250px' : '400px'} position="relative">
            <Link to="/categorylist">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Link>
            <Box
              position="absolute"
              bottom={isSmallScreen ? '10px' : '20px'}
              left={isSmallScreen ? '10px' : '20px'}
              color="white"
              zIndex={1}
              padding={isSmallScreen ? '5px' : '10px'}
            >
              <Typography variant={isSmallScreen ? 'h6' : 'h4'} component="h2" fontWeight="bold">
                Explore Our Rooms
              </Typography>
              <Typography variant={isSmallScreen ? 'body2' : 'subtitle1'} component="p">
                Book your perfect room now!
              </Typography>
            </Box>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default ImageCarousel;

