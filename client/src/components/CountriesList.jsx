import React, { useState, useEffect } from 'react';

const CountriesList = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/iso')
      .then(response => response.json())
      .then(data => {
        setCountries(data.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  return (
    <div>
      <h2>Country List</h2>
      <ul className="list-group">
        {countries.map(country => (
          <li key={country.iso2} className="list-group-item">
            {country.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountriesList;