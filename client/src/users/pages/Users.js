import React, { useState, useEffect, useCallback } from "react";

import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHTTPRequest } from "../../shared/hooks/http-hook";

const Users = () => {
  const [sendRequest, isLoading, errorMessage, clearError] = useHTTPRequest();
  const [loadedUsers, setLoadedUsers] = useState();

  const getResponse = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/"
      );
      setLoadedUsers(responseData.users);
    } catch (error) {}
  }, [sendRequest]);

  useEffect(() => {
    getResponse();
  }, [getResponse]);

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {loadedUsers && <UserList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
