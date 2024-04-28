import { union } from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useSearchParams = (keys) => {
  const location = useLocation();
  const [values, setValues] = useState([]);
  const tempValues = [];

  // Function to extract email from URL
  const getEmailFromURL = (key) => {
    // Get the search query parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    // Extract the parameter value
    const value = searchParams.get(key);
    tempValues.push(value);
  };

  useEffect(() => {
    keys.forEach((key) => getEmailFromURL(key));

    setValues(union(tempValues));
  }, [location.search]);

  return values;
};
