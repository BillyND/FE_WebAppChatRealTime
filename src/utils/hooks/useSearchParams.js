import { union } from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { debounce } from "../utilities";

/**
 * Custom hook to extract and manage search parameters from the URL.
 * @param {Array} keys - An array of parameter keys to extract from the URL.
 * @returns {Array} - An array containing the extracted parameter values.
 */
export const useSearchParams = (keys) => {
  const location = useLocation();
  const [values, setValues] = useState([]);

  // Temporary array to store parameter values
  const tempValues = [];

  // Function to extract parameter value from URL by key
  const getValueFromURL = (key) => {
    const searchParams = new URLSearchParams(location.search);
    const value = searchParams.get(key);
    tempValues.push(value);
  };

  // Debounced function to update values with extracted parameters
  const onChangeParams = debounce(() => {
    setValues(union(tempValues));
  }, 10);

  useEffect(() => {
    // Extract parameter values from URL for each key
    keys.forEach((key) => getValueFromURL(key));

    // Update values when search parameters change
    onChangeParams();
  }, [location.search]); // Re-run effect when the search query changes

  return values; // Return the extracted parameter values
};
