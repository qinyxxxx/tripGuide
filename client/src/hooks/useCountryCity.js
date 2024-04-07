import { useState, useEffect, useCallback } from "react";

const useCountryCity = () => {
  const [countries, setCountries] = useState([]);

  const getCountries = async () => {
    try {
      const response = await fetch('https://api.countrystatecity.in/v1/countries', {
        method: "GET",
        headers: {
          "X-CSCAPI-KEY": process.env.REACT_APP_EXTERNAL_API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCities = useCallback(async (countryName) => {
    if (!countryName || !countries.length) return [];

    const country = countries.find(country => country.name === countryName);
    if (!country) {
      throw new Error("Country not found");
    }
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${country.iso2}/cities`, {
        method: "GET",
        headers: {
          "X-CSCAPI-KEY": process.env.REACT_APP_EXTERNAL_API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get cities");
      }
      const data = await response.json();
      const uniqueCities = data.reduce((acc, current) => {
        if (!acc.some(item => item.name === current.name)) {
          acc.push(current);
        }
        return acc;
      }, []);
      return uniqueCities;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [countries]);

  useEffect(() => {
    getCountries();
  }, []);

  return { countries, getCities };
};

export default useCountryCity;
