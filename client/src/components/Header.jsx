import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth0();
  return (
    <header style={{ position: 'sticky', top: '0', zIndex: '1000', backgroundColor: 'rgba(255, 255, 255)' }} className="sticky-top shadow py-2">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">Trip Guide</h1>
        <div className="d-flex justify-content-center align-items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? "btn text-dark active-link" : "btn text-dark"}>Home</NavLink>
          <NavLink to="/my-tripguides" className={({ isActive }) => isActive ? "btn text-dark active-link" : "btn text-dark"}>My Posts</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "btn text-dark active-link" : "btn text-dark"}>My Profile</NavLink>
        </div>
        <div>
          {user ? (
            <span className="me-3">Hi, {user.name}!</span>) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? "btn btn-outline-dark btn-sm me-3 active-link" : "btn btn-outline-dark btn-sm me-3"}>
              Login
            </NavLink>
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