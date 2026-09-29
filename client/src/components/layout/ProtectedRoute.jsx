import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Verifying student authentication..." />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and preserve intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
