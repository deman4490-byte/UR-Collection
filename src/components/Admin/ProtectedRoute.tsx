import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Guard
 * Strictly protects all /admin/* routes.
 * If user is not authenticated, redirects directly to /admin/login.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center p-4 selection:bg-brand-orange selection:text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-orange to-amber-400 flex items-center justify-center font-black text-brand-navy text-2xl shadow-xl mb-4 animate-pulse">
          UR
        </div>
        <div className="w-7 h-7 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <span className="text-white/80 text-xs mt-3 font-bold tracking-wide">
          Verifying Admin Credentials...
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect unauthenticated visitors to /admin/login while preserving the intended destination
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
