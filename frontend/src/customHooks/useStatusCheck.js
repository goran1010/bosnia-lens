import { useEffect, useRef, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, setLongWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);
  const userChecked = useRef(false);

  const isMounted = useRef(true);

  let timeoutId = useRef(null);
  let reload = useRef(null);

  try {
    useEffect(() => {
      setLongWait(false);

      async function checkLogin() {
        try {
          timeoutId.current = setTimeout(() => {
            if (userChecked.current === false && isMounted.current) {
              setLongWait(true);
            }
          }, 4000);

          // Reload the page when the server is taking too long to respond (e.g., waking up from sleep)
          // Needed to resolve a bug preventing client to contact the server after it wakes up, without refreshing the page
          reload.current = setTimeout(() => {
            if (userChecked.current === false && isMounted.current) {
              window.location.reload();
            }
          }, 20000);

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
          isMounted.current = false;
          clearTimeout(timeoutId.current);
          clearTimeout(reload.current);
          setLoading(false);
          setLongWait(false);

          // If the user is not checked due to no response from server, reload the page to try again
          // if (!userChecked.current) {
          //   console.warn("Reload");
          //   window.location.reload();
          // }
        }
      }

      checkLogin();
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
