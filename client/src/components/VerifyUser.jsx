// import "../style/appLayout.css";

import { useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function verifyUser() {
      // make a call to our API to verify the user in our database, if it doesn't exist we'll insert it into our database
      // finally we'll redirect the user to the / route
      const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = await data.json();

      if (user.auth0Id) {
        navigate("/");
      }
    }

    if (accessToken) {
      verifyUser();
    }
  }, [accessToken, navigate]);

  return <div className="loading">Loading...</div>;
}
