/**
 * Users Feature
 * 
 * This feature handles user management functionality including:
 * - User profiles
 * - User search
 * - User preferences
 * - User roles and permissions
 */

// Export components
export { default as UserList } from './components/UserList';
export { default as UserProfile } from './components/UserProfile';
export { default as UserCard } from './components/UserCard';
export { default as UserRoleSelector } from './components/UserRoleSelector';

// Export hooks
export { default as useUsers } from './hooks/useUsers';
export { default as useUserProfile } from './hooks/useUserProfile';
export { default as useUserSearch } from './hooks/useUserSearch';
export { default as useUserPermissions } from './hooks/useUserPermissions';

// Export services
export { default as userService } from './services/userService';
export { default as userSearchService } from './services/userSearchService';

// Export types
export * from './types';

// Export routes
export { default as UserRoutes } from './routes';