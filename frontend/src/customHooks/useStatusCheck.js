import { useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

export default function useStatusCheck(
  setUserData,
  setLoading,
  notificationValue,
) {
  const { addNotification } = notificationValue;
  useEffect(() => {
    let isMounted = true;

    async function checkLogin() {
      try {
        if (!isMounted) return;

        const response = await fetch(`${URL}/auth/me`, {
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
          console.warn(result.error);
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
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkLogin();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
