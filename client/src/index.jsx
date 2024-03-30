import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import VerifyUser from "./components/VerifyUser";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./styles/index.css";
import About from "./components/About";
import Home from "./components/Home";
import GuideAction from "./components/GuideAction";
import AuthDebugger from "./components/AuthDebugger";
import GuideDetail from "./components/GuideDetail";
import Profile from "./components/Profile";
import MyTripGuide from "./components/MyTripGuides"


const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

const requestedScopes = ["profile", "email"];

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-tripguides" element={<MyTripGuide />} />
            <Route path="/guide/detail/:id" element={<GuideDetail />} />
            <Route path="/guide/create" element={<GuideAction action="create" />} />
            <Route path="/guide/edit/:id" element={<GuideAction action="edit" />} />
            <Route path="/about" element={<About />} />
            <Route path="/debugger" element={<AuthDebugger />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
