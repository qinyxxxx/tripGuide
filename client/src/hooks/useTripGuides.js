import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

const useTripGuides = () => {
  const [tripGuides, setTripGuides] = useState([]);

  useEffect(() => {
    const fetchTripGuides = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip guides");
        }
        const data = await response.json();
        setTripGuides(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTripGuides();
  }, []);

  return tripGuides;
};

export default useTripGuides;
