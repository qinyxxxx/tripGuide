import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";
const Header = () => {
  const { user, logout } = useAuth0();
  return (
    <Navbar bg="white" expand="md" className="sticky-top py-3 shadow">
      <Container className="d-flex justify-content-center align-items-center">
        <Navbar.Brand href="/">Trip Guide</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className={({ isActive }) => isActive ? "btn text-dark active-link" : "btn text-dark"}>Home</NavLink>
            <NavLink to="/my-tripguides" className={({ isActive }) => isActive ? "btn text-dark active-link" : "btn text-dark"}>My Posts</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "btn text-dark active-link" : "btn text-dark"}>My Profile</NavLink>
          </Nav>
          {user ? (
            <>
              <span className="mx-3 greeting">Hi, {user.name}!</span>
              <div className="logout-button-container">
                <Button
                  variant="outline-secondary"
                  className="btn btn-outline-dark btn-sm me-3"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-outline-dark btn-sm me-3">
              Login
            </NavLink>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;