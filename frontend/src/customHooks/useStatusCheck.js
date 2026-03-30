import { useEffect, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, longWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const abortController = new AbortController();
    let checkLoginTimeoutId;

    async function checkLogin() {
      let response;
      try {
        response = await fetch(`${URL}/users/me`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
          signal: abortController.signal,
        });

        const result = await response.json();

        if (isCancelled) {
          return;
        }

        if (!response.ok) {
          addNotification({
            type: "error",
            message: result.error,
          });
          setLoading(false);
          return;
        }

        addNotification({
          type: "success",
          message: "Login status checked successfully.",
        });
        setLoading(false);
        setUserData(result.data);
      } catch (err) {
        if (isCancelled || err?.name === "AbortError") {
          return;
        }
        console.error(err);
        setLoading(false);
      }
    }
    if (!longWait) {
      // Need to add a slight delay before checking the server status to avoid race conditions ?!
      // To-Do : Implement a more robust solution for this
      checkLoginTimeoutId = setTimeout(() => {
        if (!isCancelled) {
          checkLogin();
        }
      }, 100);
    }

    return () => {
      isCancelled = true;
      abortController.abort();
      clearTimeout(checkLoginTimeoutId);
    };
  }, [addNotification, setLoading, longWait]);

  return { userData, setUserData };
}

export { useStatusCheck };
