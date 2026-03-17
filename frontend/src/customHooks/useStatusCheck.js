import { useEffect, useRef, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, setLongWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);
  const userChecked = useRef(false);

  try {
    useEffect(() => {
      setLongWait(false);
      let isMounted = true;

      async function checkLogin() {
        // Show long wait message after 4 seconds
        const timeoutId = setTimeout(() => {
          if (userChecked.current === false && isMounted) {
            setLongWait(true);
          }
        }, 4000);

        const reload = setTimeout(() => {
          if (userChecked.current === false && isMounted) {
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
            clearTimeout(reload);
            setLoading(false);
            setLongWait(false);
          }
        }
      }

      checkLogin();

      return () => {
        isMounted = false;
      };
    }, [addNotification, setLoading, setLongWait]);

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
