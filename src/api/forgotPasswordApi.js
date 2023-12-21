import instance from '../utils/Axios';
import { baseUrl } from '../utils/constants';

const forgotPasswordApi = async (email) => {
  try {
    const formData = new FormData();

    if (email) formData.append('email', email);

    const response = await instance.post(`${baseUrl}/api/forgot-password/`, formData, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 200) {
      console.log('Email sent');
      return response.data; // Resolve the promise with response data
    } else {
      console.log('Request failed with status code:', response.status);
      return Promise.reject(response); // Reject the promise with the response for error handling
    }
  } catch (error) {
    console.error('API request error:', error);
    return Promise.reject(error); // Reject the promise with the error for error handling
  }
};


export default forgotPasswordApi;