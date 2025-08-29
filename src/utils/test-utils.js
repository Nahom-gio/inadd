import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function that includes providers
const AllTheProviders = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data for common components
export const mockProjects = [
  {
    id: 1,
    title: 'Test Project 1',
    description: 'This is a test project description',
    image: '/test-image-1.jpg',
    category: 'Marketing',
    client: 'Test Client 1',
    year: '2024',
  },
  {
    id: 2,
    title: 'Test Project 2',
    description: 'Another test project description',
    image: '/test-image-2.jpg',
    category: 'Branding',
    client: 'Test Client 2',
    year: '2024',
  },
];

export const mockServices = [
  {
    id: 1,
    title: 'Digital Marketing',
    description: 'Comprehensive digital marketing solutions',
    icon: '📱',
    features: ['SEO', 'PPC', 'Social Media'],
  },
  {
    id: 2,
    title: 'Brand Strategy',
    description: 'Strategic brand development and positioning',
    icon: '🎯',
    features: ['Brand Identity', 'Market Research', 'Positioning'],
  },
];

export const mockClients = [
  {
    id: 1,
    name: 'Test Company 1',
    logo: '/test-logo-1.png',
    industry: 'Technology',
  },
  {
    id: 2,
    name: 'Test Company 2',
    logo: '/test-logo-2.png',
    industry: 'Healthcare',
  },
];

export const mockBlogPosts = [
  {
    id: 1,
    title: 'Test Blog Post 1',
    excerpt: 'This is a test blog post excerpt',
    author: 'Test Author',
    date: '2024-01-15',
    category: 'Marketing',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Test Blog Post 2',
    excerpt: 'Another test blog post excerpt',
    author: 'Test Author 2',
    date: '2024-01-10',
    category: 'Branding',
    readTime: '3 min read',
  },
];

// Mock functions
export const mockScrollTo = jest.fn();
export const mockIntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Setup global mocks
export const setupGlobalMocks = () => {
  global.scrollTo = mockScrollTo;
  global.IntersectionObserver = mockIntersectionObserver;
};

// Clean up mocks
export const cleanupGlobalMocks = () => {
  jest.clearAllMocks();
};

// Custom matchers
export const expectElementToBeVisible = element => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectElementToHaveText = (element, text) => {
  expect(element).toHaveTextContent(text);
};

export const expectElementToHaveClass = (element, className) => {
  expect(element).toHaveClass(className);
};

export const expectElementToBeDisabled = element => {
  expect(element).toBeDisabled();
};

export const expectElementToBeEnabled = element => {
  expect(element).not.toBeDisabled();
};

// Async utilities
export const waitForElementToBeRemoved = async element => {
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(element).not.toBeInTheDocument();
};

export const waitForLoadingToFinish = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
};
