import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import PageLoader from '../components/common/PageLoader';
import NotFoundPage from '../pages/NotFoundPage';
import { PrivateRoute } from './PrivateRoute';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../features/auth/components/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/components/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/components/DashboardPage'));
const ProfilePage = lazy(() => import('../features/users/components/ProfilePage'));
const SettingsPage = lazy(() => import('../features/settings/components/SettingsPage'));
const UsersPage = lazy(() => import('../features/users/components/UsersPage'));
const UserDetailPage = lazy(() => import('../features/users/components/UserDetailPage'));

/**
 * Application routes component
 * Handles route definitions and applies authentication protection
 */
export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={<PrivateRoute element={<DashboardPage />} />} 
          />
          <Route 
            path="/profile" 
            element={<PrivateRoute element={<ProfilePage />} />} 
          />
          <Route 
            path="/settings" 
            element={<PrivateRoute element={<SettingsPage />} />} 
          />
          
          {/* Nested routes example for users management */}
          <Route path="/users">
            <Route 
              index 
              element={<PrivateRoute element={<UsersPage />} />}
            />
            <Route 
              path=":id" 
              element={<PrivateRoute element={<UserDetailPage />} />}
            />
          </Route>
          
          {/* Special routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;