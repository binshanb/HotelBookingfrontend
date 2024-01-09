import React from 'react';
import { Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '16px', // 
    margin: 'auto',
    maxWidth: '600px',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  },
  heading: {
    fontSize: '24px', // Example font-size
    marginBottom: '12px',
  },
  bodyText: {
    lineHeight: '1.6', // Example line-height
    color: '#333', // Example color
  },
  mainContent: {
    padding: '20px',
    marginBottom: '20px'
   
  },
});

const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <>
    <Paper className={classes.root} elevation={3}>
      <Typography variant="h4" component="h1" className={classes.heading}>
        Privacy Policy
      </Typography>

      <div className={classes.mainContent}>
      <Typography variant="body1" className={classes.bodyText} paragraph>
        Welcome to our Hotel Booking Privacy Policy. This policy describes how we collect, use, and protect your personal information when you use our hotel booking services.
      </Typography>
      
      {/* Other sections with Typography or other Material-UI components */}
      
      <Typography variant="body1" className={classes.bodyText} paragraph>
        Thank you for using our Hotel Booking services.
      </Typography>
      </div>
      
    </Paper>

    </>
    
  );
};

export default PrivacyPolicy;
