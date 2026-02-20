import { useEffect } from "react";
const URL = import.meta.env.VITE_BACKEND_URL;

export default function useStatusCheck(setUserData, setLoading) {
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
          console.warn(result.error);
          return;
        }
        setUserData(result.data);
      } catch (err) {
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
