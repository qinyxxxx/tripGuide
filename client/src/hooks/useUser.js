import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";


const useUser = () => {
  const [user, setUser] = useState("");
  const { accessToken } = useAuthToken();

  // get user profile
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (accessToken) {
      getUserProfile();
    }
  }, [accessToken]);

  const updateUserProfile = async (newUserData) => {
    if (accessToken) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
          method: 'PUT', headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newUserData),
        });
        if (!response.ok) {
          throw new Error('Failed to update user');
        }
        const updatedUser = await response.json();
        setUser(updatedUser);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return [user, updateUserProfile];
}


export default useUser;
