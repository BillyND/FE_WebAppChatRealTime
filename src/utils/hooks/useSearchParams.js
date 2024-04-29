import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useSearchParams = (keys) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(location.search)
  );

  const onUpdatePrams = () => {
    setSearchParams(new URLSearchParams(location.search));
  };

  useEffect(() => {
    onUpdatePrams();
  }, [location.search]);

  const values = keys.map((key) => searchParams.get(key));

  return values;
};
