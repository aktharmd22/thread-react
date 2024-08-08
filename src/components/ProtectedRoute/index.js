import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const accessToken = Cookies.get('jwt_token');
  if (!accessToken) {
    return <Navigate to="/userlogin" />;
  }
  return children;
};

export default ProtectedRoute;
