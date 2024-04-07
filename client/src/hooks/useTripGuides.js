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

  const validateGuideData = async (guideData) => {
    const requiredFields = ['title', 'country', 'rating', 'content'];
    let errorMessage = '';
    for (const field of requiredFields) {
      if (!guideData[field]) {
        errorMessage = `${field} is required`;
        break;
      }
    }
    if (typeof guideData.title !== "string" || guideData.title.length > 30) {
      errorMessage = "Title must be a string with max length of 30 characters";
    }
    if (typeof guideData.rating !== "number" || guideData.rating < 1 || guideData.rating > 5) {
      errorMessage = "Rating must be a number between 1 and 5";
    }
    if (typeof guideData.content !== "string" || guideData.content.length > 1000) {
      errorMessage = "Content must be a string with max length of 1000 characters";
    }
    if (typeof guideData.duration !== "number" || guideData.duration <= 0) {
      console.log("here");
      errorMessage = "Days must be a positive number";
    }
    if (typeof guideData.cost !== "number" || guideData.cost <= 0) {
      errorMessage = "Cost must be a positive number";
    }
    return { isValid: !errorMessage, errorMessage };
  };

  // create a new guide
  const createTripGuide = async (newGuideData) => {
    try {
      const { isValid, errorMessage } = await validateGuideData(newGuideData);
      if (!isValid) {
        alert(errorMessage);
        return { success: false, data: null };
      } else {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newGuideData),
        });
        if (response.ok) {
          const data = await response.json();
          setTripGuides(prevTripGuides => [...prevTripGuides, data]);
          return { success: true, data: data };
        } else {
          alert(response.json().error);
          return { success: false, data: null };
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTripGuide = async (guideId, updatedGuideData) => {
    try {
      const { isValid, errorMessage } = await validateGuideData(updatedGuideData);
      if (!isValid) {
        alert(errorMessage);
        return { success: false, data: null };
      } else {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tripguides/${guideId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedGuideData),
        });
        if (response.ok) {
          const data = await response.json();
          setTripGuides(prevTripGuides =>
            prevTripGuides.map(guide =>
              guide.id === guideId ? updatedGuideData : guide
            )
          );
          return { success: true, data: data };
        } else {
          alert("hello", response.json().error);
          return { success: false, data: null };
        }
      }

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
