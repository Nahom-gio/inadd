# Testing & Quality Assurance Guide

## 🧪 Testing Overview

This project includes a comprehensive testing and quality assurance setup to ensure code reliability, maintainability, and user experience quality.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests for CI/CD
npm run test:ci
```

### Code Quality Checks
```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check

# Run all quality checks
npm run quality
```

## 📁 Test Structure

```
src/
├── components/
│   ├── __tests__/           # Component test files
│   │   ├── Hero.test.js
│   │   ├── ErrorBoundary.test.js
│   │   └── ...
│   └── ...
├── utils/
│   ├── test-utils.js        # Testing utilities and helpers
│   └── ...
└── setupTests.js            # Global test configuration
```

## 🧩 Testing Libraries

- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **Jest DOM**: Custom Jest matchers for DOM testing
- **User Event**: Simulate user interactions

## 📝 Writing Tests

### Component Test Structure

```javascript
import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import ComponentName from '../ComponentName';

describe('ComponentName Component', () => {
  describe('Rendering', () => {
    test('renders correctly', () => {
      render(<ComponentName />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('handles user input', () => {
      render(<ComponentName />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(input.value).toBe('test');
    });
  });
});
```

### Testing Utilities

Use the custom test utilities from `src/utils/test-utils.js`:

```javascript
import { 
  render, 
  screen, 
  mockProjects, 
  expectElementToBeVisible 
} from '../utils/test-utils';

// Custom render with providers
render(<Component />);

// Mock data
const projects = mockProjects;

// Custom assertions
expectElementToBeVisible(element);
```

## 🔧 Configuration Files

### ESLint (.eslintrc.js)
- React-specific rules
- Accessibility guidelines
- Import ordering
- Code style consistency

### Prettier (.prettierrc)
- Code formatting rules
- Consistent indentation
- Quote preferences

### Jest (jest.config.js)
- Test environment setup
- Coverage thresholds
- File mocking
- Performance monitoring

## 🎯 Test Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🚨 Error Handling

### Error Boundary Component

The `ErrorBoundary` component provides:
- Graceful error handling
- User-friendly error messages
- Error reporting capabilities
- Recovery options

### Usage

```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## 📱 Testing Best Practices

### 1. Test User Behavior
```javascript
// ✅ Good: Test what users see and do
test('user can submit form', () => {
  render(<Form />);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// ❌ Avoid: Testing implementation details
test('calls onSubmit function', () => {
  const mockSubmit = jest.fn();
  render(<Form onSubmit={mockSubmit} />);
  // Don't test internal function calls
});
```

### 2. Use Semantic Queries
```javascript
// ✅ Good: Use semantic queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email address');
screen.getByText('Submit form');

// ❌ Avoid: Using test-specific attributes
screen.getByTestId('submit-button');
```

### 3. Test Accessibility
```javascript
test('has proper heading structure', () => {
  render(<Component />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toBeInTheDocument();
});
```

### 4. Mock External Dependencies
```javascript
// Mock API calls
jest.mock('../api', () => ({
  fetchData: jest.fn(() => Promise.resolve(mockData))
}));

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

## 🔍 Debugging Tests

### Debug Mode
```bash
# Run tests in debug mode
npm test -- --debug

# Run specific test file
npm test -- Hero.test.js

# Run tests matching pattern
npm test -- --testNamePattern="renders correctly"
```

### Console Logging
```javascript
test('debug test', () => {
  render(<Component />);
  screen.debug(); // Shows DOM structure
  screen.debug(screen.getByRole('button')); // Shows specific element
});
```

## 📊 Coverage Reports

After running `npm run test:coverage`, view the HTML report:

```bash
# Open coverage report
open coverage/lcov-report/index.html
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Quality Checks
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run quality
```

## 🛠️ Troubleshooting

### Common Issues

1. **Tests failing due to missing mocks**
   - Check `setupTests.js` for global mocks
   - Add component-specific mocks as needed

2. **Coverage not meeting thresholds**
   - Add tests for uncovered code paths
   - Use `--coverage --watchAll=false` for accurate coverage

3. **ESLint errors**
   - Run `npm run lint:fix` to auto-fix issues
   - Check `.eslintrc.js` for rule configuration

4. **Prettier formatting issues**
   - Run `npm run format` to format all files
   - Check `.prettierrc` for formatting rules

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Run quality checks before committing
4. Update this documentation if needed

## 📈 Performance Testing

Monitor test performance:
```bash
# Run tests with performance metrics
npm test -- --verbose --detectOpenHandles
```

## 🔒 Security Testing

- Test input validation
- Verify error messages don't leak sensitive information
- Test authentication flows
- Validate API endpoint security

---

**Remember**: Good tests are maintainable, readable, and focus on user behavior rather than implementation details.
