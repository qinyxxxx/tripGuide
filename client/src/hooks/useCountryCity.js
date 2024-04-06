import { useState, useEffect } from "react";

const useCountryCity = () => {
  const [countries, setCountries] = useState([]);
  console.log(process.env.REACT_APP_EXTERNAL_API_KEY);
  const getCountries = async () => {
    try {
      const response = await fetch('https://api.countrystatecity.in/v1/countries',{
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

  const getCities = async (countryIso2) => {
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryIso2}/cities`, {
        method: "GET",
        headers: {
          "X-CSCAPI-KEY": process.env.REACT_APP_EXTERNAL_API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get cities");
      }
      const data = await response.json();
      const uniqueData = data.reduce((acc, current) => {
        if (!acc.some(item => item.name === current.name)) {
          acc.push(current);
        }
        return acc;
      }, []);

      return uniqueData;
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
