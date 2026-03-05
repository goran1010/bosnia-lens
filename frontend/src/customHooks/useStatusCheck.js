import { useEffect, useRef, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, setLongWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);
  const userChecked = useRef(false);

  useEffect(() => {
    setLongWait(false);
    async function checkLogin() {
      // Show long wait message after 4 seconds
      const timeoutId = setTimeout(() => {
        if (userChecked.current === false) {
          setLongWait(true);
        }
      }, 4000);

      try {
        const response = await fetch(`${URL}/users/me`, {
          mode: "cors",
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
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
        addNotification({
          type: "error",
          message: "An error occurred while checking login status.",
        });
        console.error(err);
      } finally {
        userChecked.current = true;
        clearTimeout(timeoutId);
        setLoading(false);
        setLongWait(false);
      }
    }

    checkLogin();
  }, [addNotification, setUserData, setLoading, setLongWait]);

  return { userData, setUserData };
}

export { useStatusCheck };
