# Testing Strategy

This project uses a comprehensive testing approach with different types of tests:

## Test Types

### Unit Tests
- Test individual functions, components, and utilities in isolation
- Located in `tests/unit`
- Fast execution, focused scope
- Use Jest and Testing Library

### Integration Tests
- Test interactions between multiple components or services
- Located in `tests/integration`
- Test data flow and communications
- Use Testing Library with more complex setups

### End-to-End Tests
- Test complete user flows from start to finish
- Located in `tests/e2e`
- Simulate real user behavior
- Use Cypress or Playwright

## Test Conventions

### File Naming
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.spec.ts` or `*.spec.tsx`
- End-to-end tests: `*.e2e.ts`

### Test Structure
Each test file should follow the Arrange-Act-Assert pattern:
1. **Arrange**: Set up the test environment and test data
2. **Act**: Perform the actions being tested
3. **Assert**: Verify the expected outcomes

### Test Organization
- Group related tests with `describe` blocks
- Use clear, descriptive test names with `it` or `test`
- Keep tests focused on a single piece of functionality
- Use setup and teardown functions where appropriate

## Mock Strategies

### API Mocks
- Use MSW (Mock Service Worker) to intercept and mock API calls
- Define handlers in `tests/mocks/handlers.ts`
- Setup server in `tests/mocks/server.ts`

### Component Mocks
- Use Jest's mock functionality for component dependencies
- Create mock components in `tests/mocks/components`
- Use `jest.mock()` to replace dependencies

### Store Mocks
- Mock state management stores for predictable testing
- Create mock stores in `tests/mocks/store`
- Use test providers to wrap components

## Example Tests

### Unit Test Example
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Test Example
```typescript
// UserProfile.spec.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import UserProfile from '../features/users/components/UserProfile';

describe('UserProfile Integration', () => {
  it('loads and displays user data', async () => {
    render(
      <MemoryRouter>
        <UserProfile userId="123" />
      </MemoryRouter>
    );
    
    // Verify loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Verify profile elements
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });
  
  it('shows error message when user not found', async () => {
    render(
      <MemoryRouter>
        <UserProfile userId="invalid" />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });
});
```

## Running Tests

- Run unit tests: `npm run test:unit`
- Run integration tests: `npm run test:integration`
- Run e2e tests: `npm run test:e2e`
- Run all tests: `npm test`
- Run tests with coverage: `npm run test:coverage`