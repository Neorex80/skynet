# Authentication Feature

The authentication feature handles user authentication, registration, session management, and authorization.

## Key Components

### API Integration
- Authentication requests (login, register, logout, refresh token)
- Password reset and recovery workflows
- Session validation

### Components
- Login form
- Registration form
- Password reset forms
- Multi-factor authentication (MFA) UI
- Session timeout management

### Services
- Token management (storage, refresh, validation)
- Authorization helpers
- Session management
- User permissions

### Types
- User authentication interfaces
- Token and session types
- Authentication state types

## Usage Examples

### Login Flow

```tsx
import { useAuth } from '@/features/auth';

const LoginPage = () => {
  const { login, isLoading, error } = useAuth();
  
  const handleSubmit = async (email, password) => {
    await login(email, password);
  };
  
  // Component implementation...
};
```

### Protected Routes

```tsx
import { PrivateRoute } from '@/features/auth';

// In your routes file
<Route 
  path="/dashboard" 
  element={<PrivateRoute element={<Dashboard />} />} 
/>
```

### Accessing User Information

```tsx
import { useCurrentUser } from '@/features/auth';

const ProfileComponent = () => {
  const { user, isLoading } = useCurrentUser();
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      {/* Other profile content */}
    </div>
  );
};
```

## State Management

The auth feature maintains user authentication state including:
- Current user information
- Authentication status
- Access tokens
- Permissions and roles

## Integration with Backend

By default, the auth feature is configured to work with:
- JWT-based authentication
- Cookie-based sessions
- OAuth providers

The API integration can be customized to work with different authentication systems by modifying the services in `services/`.