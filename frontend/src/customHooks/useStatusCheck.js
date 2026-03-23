import { useEffect, useRef, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, setLongWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);

  const userChecked = useRef(false);

  let timeoutId = useRef(null);
  let reload = useRef(null);

  useEffect(() => {
    setLongWait(false);

    async function checkLogin() {
      try {
        timeoutId.current = setTimeout(() => {
          if (userChecked.current === false) {
            setLongWait(true);
          }
        }, 4000);

        // Reload the page when the server is taking too long to respond (e.g., waking up from sleep)
        // Needed to resolve a bug preventing client to contact the server after it wakes up, without refreshing the page
        reload.current = setTimeout(() => {
          if (userChecked.current === false) {
            window.location.reload();
          }
        }, 20000);

        const response = await fetch(`${URL}/users/me`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (response.status >= 500) {
          addNotification({
            type: "error",
            message: "Server is currently unavailable. Please try again later.",
          });
          setLoading(false);
          return;
        }

        if (!response.ok) {
          addNotification({
            type: "error",
            message: result.error,
          });
          userChecked.current = true;
          clearTimeout(timeoutId.current);
          clearTimeout(reload.current);
          setLoading(false);
          setLongWait(false);
          return;
        }
        addNotification({
          type: "success",
          message: "Login status checked successfully.",
        });
        setUserData(result.data);

        userChecked.current = true;
        clearTimeout(timeoutId.current);
        clearTimeout(reload.current);
        setLoading(false);
        setLongWait(false);
      } catch (err) {
        addNotification({
          type: "error",
          message: "An error occurred while checking login status.",
        });

        setLoading(false);
        setLongWait(false);
        clearTimeout(timeoutId.current);
        clearTimeout(reload.current);
        console.error(err);
      }
    }

    checkLogin();
  }, [addNotification, setLoading, setLongWait]);

  return { userData, setUserData };
}

export { useStatusCheck };
