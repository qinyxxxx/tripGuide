import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

const useTripGuides = () => {
  const [tripGuides, setTripGuides] = useState([]);
  const { accessToken } = useAuthToken();

  // get all guides
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

  // get single trip guide
  const useSingleGuide = (id) => {
    const [guide, setGuide] = useState(null);

    useEffect(() => {
      const fetchSingleGuide = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch single guide");
          }
          const data = await response.json();
          setGuide(data);
        } catch (error) {
          console.error(error);
        }
      };

      if (id) {
        fetchSingleGuide();
      }
    }, [id]);

    return guide;
  };

  const createTripGuide = async (newGuideData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newGuideData),
      });
      if (!response.ok) {
        throw new Error("Failed to create trip guide");
      }
      const data = await response.json();
      setTripGuides([...tripGuides, data]); 
      return data; 
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { tripGuides, useSingleGuide, createTripGuide };
};

export default useTripGuides;
