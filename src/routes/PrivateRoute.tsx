import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
  redirectTo?: string;
}

/**
 * PrivateRoute component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  element, 
  redirectTo = '/login' 
}) => {
  const location = useLocation();
  
  // Check if user is authenticated
  // This is a simplified example - in a real application,
  // you would use your auth context or store to check this
  const isAuthenticated = localStorage.getItem('auth_token') !== null;

  if (!isAuthenticated) {
    // Redirect to login page but save the current location
    // so we can redirect back after successful login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected element
  return element;
};