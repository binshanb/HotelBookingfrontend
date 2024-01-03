import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  customButton: {
    width: '150px', // Adjust width as needed
    fontSize: '14px', // Adjust font size as needed
    // Add any other styles you want here
  },
}));

const CustomButton = ({ onClick, variant, color, size, children }) => {
  const classes = useStyles();

  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      size={size}
      className={classes.customButton}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
