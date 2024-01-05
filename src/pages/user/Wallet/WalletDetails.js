import React, { useState, useEffect } from 'react';
import instance from '../../../utils/Axios';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import { Typography, CircularProgress,Card, CardContent,Box } from '@mui/material';

const WalletDetails = () => {
  const [wallet, setWallet] = useState(null);
  const users = useSelector((state) => state.auth.userInfo);
  const [decodeUserInfo, setDecodeUserInfo] = useState({});
  console.log(users,"userrn");

  useEffect(() => {
    if (users) {
      const decodedInfo = jwtDecode(users.access);
      setDecodeUserInfo(decodedInfo);
    }},[users])

    useEffect(() => {
      if (decodeUserInfo.user_id) {
        const userId = decodeUserInfo.user_id;
        const fetchWallet = async () => {
          try {
            const response = await instance.get(`/api/booking/wallet/${userId}/`);
            console.log(response.data,"wallet");
            setWallet(response.data);
          } catch (error) {
            console.error('Error fetching wallet:', error);
          }
        };

        fetchWallet();
      }
    
  }, [decodeUserInfo]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Wallet Details
        </Typography>
        <Box mt={2} mb={2}>
          {wallet ? (
            <Box>
              <Typography variant="body1">User: {decodeUserInfo.email}</Typography>
              <Typography variant="body1">Balance: {wallet.balance}</Typography>
            </Box>
          ) : (
            <Typography variant="body1">
              Loading wallet details...<CircularProgress size={20} />
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletDetails;


