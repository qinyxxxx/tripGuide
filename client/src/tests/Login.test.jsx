import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Login from "../components/Login";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock('../components/Header', () => () => 'HeaderComponent');
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Home Component Tests", () => {
  const mockLoginWithRedirect = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders without crashing", () => {
    render(<Login />);
    expect(screen.getByText("Trip Guide Web Site")).toBeInTheDocument();
  });

  test("displays Login button when not authenticated", () => {
    render(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("displays Enter App button when authenticated", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Login />);
    expect(screen.getByText("Enter App")).toBeInTheDocument();
  });

  test("Login button triggers loginWithRedirect", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("Login"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  test("Enter App button triggers navigation", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Login />);
    fireEvent.click(screen.getByText("Enter App"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("Signup button triggers loginWithRedirect with correct parameters", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("Create Account"));
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({
      screen_hint: "signup",
    });
  });
});
