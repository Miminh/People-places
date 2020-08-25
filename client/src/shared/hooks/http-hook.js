import { useState, useRef, useCallback, useEffect } from "react";

export const useHTTPRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      const abortCntller = new AbortController();
      activeHttpRequests.current.push(abortCntller);
      try {
        setIsLoading(true);
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: abortCntller.signal,
        });
        const responseData = await response.json();
        setIsLoading(false);

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (abtCtrl) => abtCtrl !== abortCntller
        );
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        return responseData;
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err.message);
        throw new Error(err);
      }
    },
    []
  );
  const clearError = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    return () => {
      //activeHttpRequests.current.forEach((abortCntller) =>
      //   abortCntller.abort()
      // );
    };
  });

  return [sendRequest, isLoading, errorMessage, clearError];
};
