// razorpay.js 

import instance from "../utils/Axios";

// Function to load the Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Function to create a Razorpay order using Axios
export const createRazorpayOrder = async (bookingId, amount) => {
  try {
    // Make an API call to your server to create a Razorpay order using Axios
    const response = await instance.post('/api/booking/create-razorpay-order/', {
      bookingId,
      amount,
      
      
    });
    console.log(bookingId,amount,"jhjjhhhjhh")
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
 }
};