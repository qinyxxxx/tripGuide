import { useState, useEffect } from "react";

const useCountryCity = () => {
  const [countries, setCountries] = useState([]);

  const getCountries = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/iso');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCountries(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCities = async (countryData) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      if (!response.ok) {
        throw new Error("Failed to get cities");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  return { countries, getCities };
};

export default useCountryCity;
