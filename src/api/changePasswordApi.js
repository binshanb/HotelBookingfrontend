import instance from '../utils/Axios';
import { baseUrl } from '../utils/constants';

const changePasswordApi = async (oldPassword, password) => {
  try {
    const accessToken = localStorage.getItem('access');

    const formData = new FormData();
    if (oldPassword) formData.append('old_password', oldPassword);
    if (password) formData.append('new_password', password);


    const response = await instance.put(`${baseUrl}/api/change-password/`, formData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      console.log('Password updated successfully');
    } else {
      console.log(response.error);
    }
  } catch (error) {
    console.error(error);
  }
};

export default changePasswordApi;