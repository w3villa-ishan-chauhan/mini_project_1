import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authcontext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  let token_value=isAuthenticated ()
  console.log("authenticted:",isAuthenticated ());

  return token_value ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
