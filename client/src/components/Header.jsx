import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Header = () => {
    const { user, logout } = useAuth0();

    return (
        <header className="bg-pink text-dark py-2">
            <div className="container d-flex justify-content-between align-items-center">
                <h1 className="h4 mb-0 text-dark">Trip Guide</h1>
                <div>
                    {user ? (
                        <span className="me-3 text-dark">Welcome, {user.name}!</span>
                    ) : (
                        <Link to="/" className="btn btn-outline-dark btn-sm me-3">
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
