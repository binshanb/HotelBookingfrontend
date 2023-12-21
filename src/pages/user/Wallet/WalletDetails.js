import React, { useState, useEffect } from 'react';
import instance from '../../../utils/Axios';
import { baseUrl } from '../../../utils/constants';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';

const WalletDetails = () => {
  const [wallet, setWallet] = useState(null);
  const users = useSelector((state) => state.auth.userInfo);
  const [decodeInfo, setDecodeInfo] = useState({});

  useEffect(() => {
    if (users) {
      const decodedInfo = jwtDecode(users.access);
      setDecodeInfo(decodedInfo);

      if (decodedInfo.user_id) {
        const userId = decodedInfo.user_id;
        const fetchWallet = async () => {
          try {
            const response = await instance.get(`${baseUrl}/api/booking/wallet/${userId}/`);
            setWallet(response.data);
          } catch (error) {
            console.error('Error fetching wallet:', error);
          }
        };

        fetchWallet();
      }
    }
  }, [users]);

  return (
    <div>
      <h2>Wallet Details</h2>
      {wallet ? (
        <div>
          <p>User: {wallet.user.email}</p>
          <p>Balance: {wallet.balance}</p>
        </div>
      ) : (
        <p>Loading wallet details...</p>
      )}
    </div>
  );
};

export default WalletDetails;

