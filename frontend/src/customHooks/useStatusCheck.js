import { useEffect, useRef, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, setLongWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);
  const userChecked = useRef(false);

  useEffect(() => {
    setLongWait(false);
    const abortController = new AbortController();
    let isMounted = true;

    async function checkLogin() {
      // Show long wait message after 4 seconds
      const timeoutId = setTimeout(() => {
        if (userChecked.current === false && isMounted) {
          setLongWait(true);
        }
      }, 4000);

      try {
        const response = await fetch(`${URL}/users/me`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
          signal: abortController.signal,
        });

        const result = await response.json();
        if (!isMounted) return;

        if (!response.ok) {
          addNotification({
            type: "error",
            message: result.error,
          });
          return;
        }
        addNotification({
          type: "success",
          message: "Login status checked successfully.",
        });
        setUserData(result.data);
      } catch (err) {
        if (err.name === "AbortError" || !isMounted) return;
        addNotification({
          type: "error",
          message: "An error occurred while checking login status.",
        });
        console.error(err);
      } finally {
        if (isMounted) {
          userChecked.current = true;
          clearTimeout(timeoutId);
          setLoading(false);
          setLongWait(false);
        }
      }
    }

    checkLogin();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [addNotification, setUserData, setLoading, setLongWait]);

  return { userData, setUserData };
}

export { useStatusCheck };
