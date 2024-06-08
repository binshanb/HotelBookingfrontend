import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../../../utils/Axios'; // Adjust the path accordingly
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';







function Register() {


  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    first_name:'',
    email: '',
    phone_number: '',
    password: '',
    password2: '',
  });
  
  const [validationErrors, setValidationErrors] = useState({});
 
  const validateFirstName = (first_name) => {
    const nameRegex = /^[a-zA-Z -]+$/;
    return nameRegex.test(first_name);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateMobileNumber = (phone_number) => {
    const mobileRegex = /^\d{10}$/; 
    return mobileRegex.test(phone_number);
  };
  
  

  const validatePassword = (password) => {
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;

    const isLowerCaseValid = lowercaseRegex.test(password);
    const isUpperCaseValid = uppercaseRegex.test(password);
    const isNumberValid = numberRegex.test(password);

    return {
      isLowerCaseValid,
      isUpperCaseValid,
      isNumberValid,
      isLengthValid: password.length >= 6,
    };
  }

  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    switch (name) {
      case 'first_name':
        if (!validateFirstName(value)) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            name: 'Invalid name format',
          }));
         
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            email: 'Invalid email format',
          }));
         
        }
        break;
      case 'phone_number':
        if (value && !validateMobileNumber(value)) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            mobileNumber: 'Invalid mobile number format',
          }));
          
        }
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isLowerCaseValid) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            password: 'Password must contain at least one lowercase letter',
          }));
        } else if (!passwordValidation.isUpperCaseValid) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            password: 'Password must contain at least one uppercase letter',
          }));
        } else if (!passwordValidation.isNumberValid) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            password: 'Password must contain at least one number',
          }));
        } else if (!passwordValidation.isLengthValid) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            password: 'Password must be at least 6 characters long',
          }));
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            password2: 'Passwords do not match',
          }));
        }
        break;
      default:
        break;
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const newErrors = {};

    if (!validateFirstName(formData.first_name)) {
      newErrors.first_name = 'Invalid name format';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.mobileNumber && !validateMobileNumber(formData.phone_number)) {
      newErrors.phone_number = 'Invalid mobile number format';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isLowerCaseValid) {
       newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!passwordValidation.isUpperCaseValid) {
       newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!passwordValidation.isNumberValid) {
       newErrors.password = 'Password must contain at least one number';
    } else if (!passwordValidation.isLengthValid) {
        newErrors = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.password2) {
       newErrors.password2 = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      Object.values(newErrors).forEach((error) => showToast(error));
      return;
    }
    console.log("Request Payload:", {
      firstName: "Shanss",
      email: "binshanb77@gmail.com",
      mobileNumber: "9544815797",
      password: "Shan1234",
      confirmPassword: "Shan1234"
    });
    try {
      // Make a POST request to your backend registration endpoint using the Axios instance
      const response = await instance.post('/api/user/register/',formData,{
        headers:{
          'Content-Type':'application/json'
        }

      });

      // Assuming your backend returns some data upon successful registration
      const data = response.data;

      // Handle the registration response
      if (response.status === 201) {

        toast.success('Extreme team has sent an OTP to your email for verification.', {
          onClose: () => {
            localStorage.setItem('randomUserEmail', formData.email);
            console.log(email,"email success");
            navigate('/verify-email');
          }
        });
      } else {
        console.log(data);
        toast.error('Invalid Details');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    }
        // Registration successful
    //     navigate('/login');
    //     console.log('Registration successful:', data);
    //     showToast('Registration successful', 'success');
    //   } else {
    //     // Registration failed
    //     console.error('Registration failed:', data);
    //     showToast('Registration failed: ' + data.error);
    //   }
    // } catch (error) {
    //   // Handle network errors or other exceptions
    //   console.error('Registration failed:', error.message);
    //   showToast('Registration failed: ' + error.message);
    // }
  };
 

  return (
    <div>
      <div className='signup template d-flex justify-content-center align-items-center vh-100 bg-gray-200' >
        <div className='form_container p-3 rounded bg-white'>
        <Avatar sx={{
      display: 'flex',
      flexDirection: 'row-reverse',
      bgcolor: 'primary.main',
      padding: '10px',
      mx:'130px',
    
    }}>
            <LockOutlinedIcon />
          </Avatar>
          <form onSubmit={handleSubmit}>
            <h3 className='text-center'>Sign Up</h3>
            <div className='mb-3'>
              <input type="text" name="first_name" placeholder='Enter Name' className='form-control' onChange={handleInputChange} />
              {validationErrors.first_name && <p className="error-message">{validationErrors.first_name}</p>}
            </div>
            
            <div className='mb-3'>
              <input type="email" name="email" placeholder='Enter Email' className='form-control' onChange={handleInputChange} />
              {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
            </div>
            <div className='mb-3'>
              <input type="text" name="phone_number" placeholder='Enter phone number' className='form-control' onChange={handleInputChange} />
              {validationErrors.phone_number && <p className="error-message">{validationErrors.phone_number}</p>}
            </div>
            <div className='mb-3'>
              <input type="password" name="password" placeholder='Enter password' className='form-control' onChange={handleInputChange} />
              {validationErrors.password && <p className="error-message">{validationErrors.password}</p>}
            </div>
            <div className='mb-3'>
              <input type="password" name="password2" placeholder='Confirm Password' className='form-control' onChange={handleInputChange} />
              {validationErrors.password2 && <p className="error-message">{validationErrors.password2}</p>}
            </div>
            <div className='mb-2'>
              <input type='checkbox' className='custom-control custom-checkbox' id='check' />
              <label htmlFor='check' className='custom-input-label ms-2'>
                Remember me
              </label>
            </div>            
            <div className='d-grid mt-2'>
              <button type="submit" className='btn btn-primary mb-3' onClick={handleSubmit}>Sign Up</button>
        
            </div>
            <p className='text-end mt-2'>
            Already have an account? <Link to='/login' className='ms-2'>Sign In</Link>
            </p>
          </form>
        </div>
      </div>
       <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Register;