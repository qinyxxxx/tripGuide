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
      return () => { };
    }, [id]);

    return guide;
  };

  // get my trip guide post
  const [myGuides, setMyGuides] = useState([]);
  useEffect(() => {
    if (accessToken) {
      const fetchMyTripGuides = async () => {
        try {

          const response = await fetch(`${process.env.REACT_APP_API_URL}/my-tripguides`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch trip guides");
          }
          const data = await response.json();
          setMyGuides(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMyTripGuides();
    }
  }, [accessToken]);

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
      setTripGuides(prevTripGuides => [...prevTripGuides, data]);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create trip guide");
    }
  };

  const updateTripGuide = async (guideId, updatedGuideData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides/${guideId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedGuideData),
      });
      if (!response.ok) {
        throw new Error("Failed to create trip guide");
      }
      const data = await response.json();
      setTripGuides(prevTripGuides =>
        prevTripGuides.map(guide =>
          guide.id === guideId ? updatedGuideData : guide
        )
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const deleteTripGuide = async (guideId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides/${guideId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create trip guide");
      }
      const data = await response.json();
      setTripGuides(prevTripGuides => prevTripGuides.filter(guide => guide.id !== guideId));
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { tripGuides, useSingleGuide, createTripGuide, myGuides, updateTripGuide, deleteTripGuide };
};

export default useTripGuides;
