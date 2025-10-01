import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedHome = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is authenticated and trying to access root, redirect to /home
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }
  
  // If not authenticated, show the landing page
  return <Navigate to="/signin" replace />;
};

export default ProtectedHome;
