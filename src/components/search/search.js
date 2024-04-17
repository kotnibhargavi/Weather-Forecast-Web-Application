import React, { useEffect, useState, useRef } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiOptions, GEO_API_URL } from "../../api";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);
  const handleOnChangeRef = useRef();

  useEffect(() => {
    handleOnChangeRef.current = (searchData) => {
      setSearch(searchData);  
      onSearchChange(searchData);
    };
  }, [onSearchChange]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (position) handleOnChangeRef.current({ value: `${position.coords.latitude} ${position.coords.longitude}`, label: 'Your Location' });
    });
  }, []);

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => {
        inputValue = "";
        return {
          options: response.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
          }),
        };
      });
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChangeRef.current}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
