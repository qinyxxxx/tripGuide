import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

const useComments = (guideId) => {
  const [comments, setComments] = useState([]);
  const { accessToken } = useAuthToken();

  // get all comments
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides/${guideId}/comments`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip guides");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };

    getComments();
  }, [guideId]);

  const createComment = async (newComment) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides/${guideId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) {
        throw new Error("Failed to create trip guide");
      }
      const data = await response.json();
      setComments((prevComments) => [...prevComments, data]);
      return data; 
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { comments, createComment };
};

export default useComments;
