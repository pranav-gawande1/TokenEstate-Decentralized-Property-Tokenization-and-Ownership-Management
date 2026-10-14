import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

/**
 * PublicOnlyRoute:
 * Prevents authenticated users from landing on `/login` or `/signup`.
 * Automatically redirects active sessions to `/dashboard`.
 */
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
