import { useState, useEffect, useCallback } from "react";

let timerId;
export default () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [expirationTime, setExpirationTime] = useState();

  const login = useCallback((uid, token, expiry) => {
    setUserId(uid);
    setToken(token);
    let tokenExpiry = expiry || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationTime(tokenExpiry);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiry: tokenExpiry.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data && expirationTime) {
      const remainingTime = expirationTime.getTime() - new Date().getTime();
      timerId = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(timerId);
    }
  }, [logout, expirationTime]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiry) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiry));
    }
  }, [login]);

  return { logout, login, token, userId };
};
