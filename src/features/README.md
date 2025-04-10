# Features Directory

The `features` directory organizes the application by feature modules, following a modular and scalable architecture.

## What is a Feature?

A feature is a self-contained module that represents a significant application capability with its own:
- Components
- Services
- API integrations
- State management
- Types
- Utilities

## Structure of a Feature

Each feature follows this structure:

```
feature-name/
├── api/                # API integration specific to this feature
├── components/         # Feature-specific components
├── hooks/              # Custom hooks for the feature
├── services/           # Business logic services
├── store/              # State management (Redux slice or context)
├── types/              # TypeScript types related to the feature
├── utils/              # Feature-specific utilities
├── index.ts            # Public API of the feature
└── routes.tsx          # Feature routing configuration
```

## Feature Guidelines

1. **Encapsulation**: Features should encapsulate their internal details and expose a clean API via `index.ts`.

2. **Isolation**: Features should be able to work independently as much as possible.

3. **Dependencies**: 
   - Features can depend on shared utilities, components, and services
   - Features should avoid circular dependencies

4. **Naming**:
   - Use kebab-case for feature directory names
   - Use PascalCase for component files
   - Use camelCase for utility and hook files

5. **Testing**:
   - Each feature should have its own tests
   - Test feature boundaries (inputs/outputs of the public API)

## Example Features

- `auth`: Authentication and authorization
- `users`: User management and profiles
- `dashboard`: Main dashboard views and functionality
- `settings`: Application settings
- `notifications`: Notification center
- `chat`: Chat functionality
- `admin`: Admin interface and functionality

## When to Create a New Feature

Create a new feature when:
- It represents a significant standalone capability
- It has its own routes/pages
- It has its own state management needs
- It could potentially be extracted into a separate package

Avoid creating a feature for:
- Small UI components (use shared components instead)
- Simple utilities (use the utils directory)
- Single-use components or functions

## Feature Registry

To make features discoverable, you can register them in a central registry:

```typescript
// src/features/index.ts
export { default as auth } from './auth';
export { default as users } from './users';
export { default as dashboard } from './dashboard';
// etc.
```