import React from 'react';
import { Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '16px',
    margin: 'auto',
    maxWidth: '600px',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '12px',
  },
  bodyText: {
    lineHeight: '1.6',
    color: '#333',
  },
  mainContent: {
    padding: '20px',
    marginBottom: '20px'
   
  },
});

const TermsAndConditions = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={3}>
      <Typography variant="h4" component="h1" className={classes.heading}>
        Terms and Conditions
      </Typography>
      
      <div className={classes.mainContent}>
        {/* Main content goes here */}
        <Typography variant="body1" className={classes.bodyText} paragraph>
          Welcome to our Hotel Booking Terms and Conditions. By using our website and booking our services, you agree to comply with these terms.
        </Typography>
        
        {/* Other sections with Typography or other Material-UI components */}
        
        <Typography variant="body1" className={classes.bodyText} paragraph>
          Thank you for choosing our Hotel Booking services.
        </Typography>
      </div>
    </Paper>
  );
};

export default TermsAndConditions;

