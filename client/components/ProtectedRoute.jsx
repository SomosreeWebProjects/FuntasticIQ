import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isUserValid, setIsUserValid] = useState(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token || !userId) {
      setIsUserValid(false);
      return;
    }

    const checkUser = async () => {
      try {
        const response = await axios.get(`/api/check-user/${userId}`);
        setIsUserValid(response.data.exists);
      } catch (error) {
        console.error('Error checking user:', error);
        setIsUserValid(false);
      }
    };

    checkUser();
  }, [token, userId]);

  if (isUserValid === null) {
    return <div>Loading...</div>; // or show a spinner
  }

  return isUserValid ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
