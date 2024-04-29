import { useLocation, useNavigate } from "react-router-dom";

/**
 * Custom hook to create a custom navigation function.
 * The custom navigation function prevents navigating to the same route with the current one.
 * @returns {function} - A custom navigation function.
 */
export const useNavigateCustom = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // Custom navigation function
  const customNavigate = (route) => {
    // Check if the route is the same as the current route
    if (route?.trim() === `${pathname}${search}`) {
      return; // Prevent navigation if it's the same route
    }

    navigate(route); // Navigate to the specified route
  };

  return customNavigate; // Return the custom navigation function
};
