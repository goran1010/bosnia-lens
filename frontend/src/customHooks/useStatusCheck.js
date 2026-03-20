import { useEffect, useRef, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, setLongWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);
  const userChecked = useRef(false);

  const isMounted = useRef(true);

  const timeoutId = setTimeout(() => {
    if (userChecked.current === false && isMounted.current) {
      setLongWait(true);
    }
  }, 4000);

  // Reload the page when the server is taking too long to respond (e.g., waking up from sleep)
  // Needed to resolve a bug preventing client to contact the server after it wakes up, without refreshing the page
  const reload = setTimeout(() => {
    if (userChecked.current === false && isMounted.current) {
      window.location.reload();
    }
  }, 10000);

  try {
    useEffect(() => {
      setLongWait(false);

      async function checkLogin() {
        // Show long wait message after 4 seconds
        const timeoutId = setTimeout(() => {
          if (userChecked.current === false && isMounted.current) {
            setLongWait(true);
          }
        }, 4000);

        // Reload the page when the server is taking too long to respond (e.g., waking up from sleep)
        // Needed to resolve a bug preventing client to contact the server after it wakes up, without refreshing the page
        const reload = setTimeout(() => {
          if (userChecked.current === false && isMounted.current) {
            window.location.reload();
          }
        }, 10000);

        try {
          const response = await fetch(`${URL}/users/me`, {
            mode: "cors",
            method: "GET",
            credentials: "include",
          });

          const result = await response.json();
          if (!isMounted.current) return;

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
          if (err.name === "AbortError" || !isMounted.current) return;
          addNotification({
            type: "error",
            message: "An error occurred while checking login status.",
          });
          console.error(err);
        } finally {
          if (isMounted.current) {
            userChecked.current = true;
          }
          clearTimeout(timeoutId);
          clearTimeout(reload);
          setLoading(false);
          setLongWait(false);
        }
      }

      checkLogin();

      return () => {
        isMounted.current = false;
        clearTimeout(timeoutId);
        clearTimeout(reload);
      };
    }, [addNotification, setLoading, setLongWait, reload, timeoutId]);

    return { userData, setUserData };
  } catch (err) {
    addNotification({
      type: "error",
      message: "An error occurred while checking login status.",
    });
    console.error(err);
  }
}

export { useStatusCheck };
