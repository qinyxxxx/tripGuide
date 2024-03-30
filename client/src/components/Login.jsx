import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Header from './Header';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    <div>
      <Header />
      <div className="container text-center mt-5">
        <h1 className="mb-4">Trip Guide Web Site</h1>
        <p className="lead mb-4">Discover amazing travel experiences shared by users like you.</p>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            {!isAuthenticated ? (
              <div className="btn-group d-flex mb-4" role="group">
                <button className="btn btn-lg btn-primary flex-grow-1 me-2" onClick={loginWithRedirect}>
                  Login
                </button>
                <button className="btn btn-lg btn-secondary flex-grow-1" onClick={signUp}>
                  Create Account
                </button>
              </div>
            ) : (
              <button className="btn btn-lg btn-secondary mb-4" onClick={() => navigate("/")}>
                Enter App
              </button>
            )}
          </div>
        </div>
        <p>Explore and share your travel experiences with others!</p>
      </div>
    </div>
  );
}
