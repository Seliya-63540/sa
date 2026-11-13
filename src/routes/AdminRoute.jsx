import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== 'ADMIN') {
    return <Navigate to={currentUser.role === 'CUSTOMER' ? '/my-account' : '/login'} replace />;
  }

  return children;
};
