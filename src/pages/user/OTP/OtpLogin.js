import { useState } from 'react';
import instance from '../../../utils/Axios'; // Assuming Axios is configured for API requests
import { baseUrl } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom'; 

const OTPLogin = () => {
  const [phone, setPhone] = useState('');
  console.log(phone,"phone");
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };


  const handleSendOTP = async () => {
    try {
      const response = await instance.post(`${baseUrl}/api/otp-sent/`, {phone_number:phone});

      
      if (response.status === 200) {
        setMessage('OTP sent successfully.');
        navigate('/otp-verify'); // Use navigate function for navigation
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl mb-4">OTP Login</h1>
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={handlePhoneChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleSendOTP}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send OTP
        </button>
        <p className="text-red-500 mt-2">{message}</p>
      </div>
    </div>
  );
};

export default OTPLogin;

