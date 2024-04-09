import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter} from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import useTripGuides from '../hooks/useTripGuides';
import Home from '../components/Home';

jest.mock('@auth0/auth0-react');
jest.mock('../hooks/useTripGuides');

describe('Home Component Tests', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
    });
    useTripGuides.mockReturnValue({
      tripGuides: [
        {
          id: 1,
          title: 'Guide Title',
          country: 'United States',
          city: 'San Jose',
          duration: 10,
          content: 'This is a test guide content.',
          rating: 5,
          cost: 1000,
          guser: { auth0Id: 'user-id', name: 'John Doe' },
          createdAt: '2020-01-01T00:00:00.000Z',
          comment: [],
        },
        {
          id: 2,
          title: 'Guide Title2',
          country: 'China',
          city: 'Shanghai',
          duration: 7,
          content: 'Shanghai is an expensive place',
          rating: 5,
          cost: 5000,
          guser: { auth0Id: 'user-id2', name: 'Zoe Dan' },
          createdAt: '2023-01-01T00:00:00.000Z',
          comment: [{
            id: 101,
            content: "That's great!",
            cuser: { auth0Id: 'user-id3', name: 'Monica Geller' },
            createdAt: '2023-02-01T00:00:00.000Z',
          }],
        },
      ],
    });
  });

  test('renders login button when not authenticated', () => {
    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('renders logout button and greeting when authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'John Doe' },
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
    });

    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText(/Hi, John Doe!/)).toBeInTheDocument();
  });

  test('renders first guide detail', () => {
    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByText('Create New Guide')).toBeInTheDocument();
    expect(screen.getByText('Guide Title')).toBeInTheDocument();
    expect(screen.getByText('San Jose')).toBeInTheDocument();
    expect(screen.getByText(/This is a test guide content./)).toBeInTheDocument();
    expect(screen.getAllByText('Details')[0]).toBeInTheDocument();
  });

  test('renders second guide detail', () => {
    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByText('Guide Title2')).toBeInTheDocument();
    expect(screen.getByText('Shanghai')).toBeInTheDocument();
    expect(screen.getByText(/Shanghai is an expensive place/)).toBeInTheDocument();
    expect(screen.getAllByText('Details')[1]).toBeInTheDocument();
    expect(screen.getByText('That\'s great!')).toBeInTheDocument();
  });
});
