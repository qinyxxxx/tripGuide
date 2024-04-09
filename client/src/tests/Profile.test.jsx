import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useUser from '../hooks/useUser';
import Profile from '../components/Profile';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../hooks/useUser');
jest.mock('../components/Header', () => () => 'HeaderComponent');

describe('Profile Component Tests', () => {
  const mockUpdateUserProfile = jest.fn();

  beforeEach(() => {
    useUser.mockReturnValue({
      user: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        gender: 'Female',
        birthDate: '1990-01-01',
        introduction: 'Hello, I am Jane Doe.'
      },
      updateUserProfile: mockUpdateUserProfile
    });
  });

  test('displays user information when user is loaded', () => {
    render(<Profile />);
    expect(screen.getAllByText('Jane Doe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('jane.doe@example.com')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Female')[0]).toBeInTheDocument();
    expect(screen.getAllByText('1990-01-01')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Hello, I am Jane Doe.')[0]).toBeInTheDocument();
  });

  test('opens edit modal on click', async () => {
    render(<Profile />);
    fireEvent.click(screen.getAllByText('Edit Profile')[0]);
    await waitFor(() => {
      expect(screen.getAllByText('Edit Profile')[1]).toBeInTheDocument();
    });
  });

  test('form is populated with user data in edit modal', () => {
    render(<Profile />);
    fireEvent.click(screen.getAllByText('Edit Profile')[0]);
    expect(screen.getByLabelText('Gender').value).toBe('Female');
    expect(screen.getByLabelText('Birth Date').value).toBe('1990-01-01');
    expect(screen.getByLabelText('Introduction').value).toBe('Hello, I am Jane Doe.');
  });

  test('submits updated user data', async () => {
    const mockUpdateUserProfile = jest.fn(() => Promise.resolve('Profile updated'));
    useUser.mockReturnValue({
      user: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        gender: 'Female',
        birthDate: '1990-01-01',
        introduction: 'Hello, I am Jane Doe.'
      },
      updateUserProfile: mockUpdateUserProfile // 使用模拟的 updateUserProfile 函数
    });
    render(<Profile />);
    fireEvent.click(screen.getAllByText('Edit Profile')[0]);
    fireEvent.change(screen.getByLabelText('Introduction'), { target: { value: 'Updated introduction' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith({
        gender: 'Female',
        birthDate: '1990-01-01',
        introduction: 'Updated introduction',
      });
    });
  });

});
