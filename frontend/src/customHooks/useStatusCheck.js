import { useEffect, useState } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

function useStatusCheck(setLoading, notificationValue, longWait) {
  const { addNotification } = notificationValue;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function checkLogin() {
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
        setLoading(false);
        setUserData(result.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (!longWait) {
      checkLogin();
    }
  }, [addNotification, setLoading, longWait]);

  return { userData, setUserData };
}

export { useStatusCheck };
