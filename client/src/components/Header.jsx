import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth0();
  return (
    <header style={{ position: 'sticky', top: '0', zIndex: '1000', backgroundColor: 'rgba(255, 255, 255)' }} className="sticky-top shadow py-2">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">Trip Guide</h1>
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/" className="btn text-dark btn-link text-decoration-none fs-8 mx-2">Home</Link>
          <Link to="/my-tripguides" className="btn text-dark btn-link text-decoration-none fs-8 mx-2">My Posts</Link>
          <Link to="/profile" className="btn text-dark btn-link text-decoration-none fs-8 mx-2">My Profile</Link>
        </div>
        <div>
          {user ? (
            <span className="me-3">Hi, {user.name}!</span>) : (
            <Link to="/login" className="btn btn-outline-dark btn-sm me-3">
              Login
            </Link>
          )}
          {user && (
            <button className="btn btn-outline-dark btn-sm" onClick={() => logout({ returnTo: window.location.origin })}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;